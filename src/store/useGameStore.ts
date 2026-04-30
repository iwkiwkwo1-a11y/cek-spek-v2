import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIRPORTS, Airport } from '../data/airports';
import { PLANE_MODELS, PlaneModel } from '../data/planes';

export interface OwnedPlane {
  id: string;
  modelId: string;
  name: string;
  engineLevel: number;
  capacityLevel: number;
  fuelEfficiencyLevel: number;
  comfortLevel: number;
  condition: number; // 0 to 100
  status: 'idle' | 'flying' | 'maintenance';
  currentAirportId: string; // Where it is or where it departed from
  route?: {
    destinationAirportId: string;
    distance: number; // km
    progress: number; // km traveled
    departureTime: number; // timestamp
    estimatedArrivalTime: number; // timestamp
    income: number;
  };
}

export interface FlightLog {
  id: string;
  planeId: string;
  planeName: string;
  from: string;
  to: string;
  income: number;
  timestamp: number;
}

interface GameState {
  money: number;
  companyName: string;
  planes: OwnedPlane[];
  logs: FlightLog[];
  lastSaved: number;
  setCompanyName: (name: string) => void;
  buyPlane: (modelId: string) => boolean;
  upgradePlane: (planeId: string, upgradeType: 'engine' | 'capacity' | 'fuelEfficiency' | 'comfort') => boolean;
  maintainPlane: (planeId: string) => boolean;
  assignRoute: (planeId: string, destinationId: string, ticketPrice: number) => boolean;
  processOfflineProgress: () => void;
  gameTick: () => void;
  addMoney: (amount: number) => void; // for testing/cheats
}

// Haversine formula to calculate distance between two coordinates in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

const UPGRADE_COSTS = {
  engine: 10000,
  capacity: 15000,
  fuel: 8000,
  comfort: 12000,
};

const FUEL_PRICE_PER_KM = 2; // base cost
const MAINTENANCE_COST_PER_PERCENT = 500;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      money: 1000000, // Start with 1M
      companyName: 'My Airline',
      planes: [],
      logs: [],
      lastSaved: Date.now(),

      setCompanyName: (name) => set({ companyName: name }),

      buyPlane: (modelId) => {
        const state = get();
        const model = PLANE_MODELS.find(p => p.id === modelId);
        if (!model || state.money < model.price) return false;

        const newPlane: OwnedPlane = {
          id: Math.random().toString(36).substring(7),
          modelId,
          name: `Flight ${state.planes.length + 1}`,
          engineLevel: 1,
          capacityLevel: 1,
          fuelEfficiencyLevel: 1,
          comfortLevel: 1,
          condition: 100,
          status: 'idle',
          currentAirportId: 'CGK', // Default start airport
        };

        set({
          money: state.money - model.price,
          planes: [...state.planes, newPlane],
        });
        return true;
      },

      upgradePlane: (planeId, upgradeType) => {
        const state = get();
        const cost = UPGRADE_COSTS[upgradeType === 'fuelEfficiency' ? 'fuel' : upgradeType];
        if (state.money < cost) return false;

        set((state) => ({
          money: state.money - cost,
          planes: state.planes.map((p) => {
            if (p.id !== planeId) return p;
            if (upgradeType === 'engine') return { ...p, engineLevel: p.engineLevel + 1 };
            if (upgradeType === 'capacity') return { ...p, capacityLevel: p.capacityLevel + 1 };
            if (upgradeType === 'fuelEfficiency') return { ...p, fuelEfficiencyLevel: p.fuelEfficiencyLevel + 1 };
            if (upgradeType === 'comfort') return { ...p, comfortLevel: p.comfortLevel + 1 };
            return p;
          }),
        }));
        return true;
      },

      maintainPlane: (planeId) => {
        const state = get();
        const plane = state.planes.find(p => p.id === planeId);
        if (!plane || plane.status !== 'idle' || plane.condition >= 100) return false;

        const damage = 100 - plane.condition;
        const cost = Math.floor(damage * MAINTENANCE_COST_PER_PERCENT);

        if (state.money < cost) return false;

        set((state) => ({
          money: state.money - cost,
          planes: state.planes.map(p => p.id === planeId ? { ...p, condition: 100 } : p)
        }));
        return true;
      },

      assignRoute: (planeId, destinationId, ticketPrice) => {
        const state = get();
        const plane = state.planes.find(p => p.id === planeId);
        if (!plane || plane.status !== 'idle') return false;

        const fromAirport = AIRPORTS.find(a => a.id === plane.currentAirportId);
        const toAirport = AIRPORTS.find(a => a.id === destinationId);
        if (!fromAirport || !toAirport || fromAirport.id === toAirport.id) return false;

        const model = PLANE_MODELS.find(m => m.id === plane.modelId);
        if (!model) return false;

        // Prevent flying if condition is too low
        if (plane.condition < 10) return false;

        const distance = calculateDistance(fromAirport.lat, fromAirport.lng, toAirport.lat, toAirport.lng);
        const speed = model.baseSpeed * (1 + (plane.engineLevel - 1) * 0.1); // 10% speed increase per level
        const durationHours = distance / speed;
        const durationMs = durationHours * 3600000;

        const now = Date.now();
        const capacity = model.baseCapacity * (1 + (plane.capacityLevel - 1) * 0.2); // 20% capacity increase per level

        // Calculate fuel cost
        const fuelEfficiencyMultiplier = 1 / (1 + (plane.fuelEfficiencyLevel - 1) * 0.15); // 15% more efficient per level
        const fuelCost = Math.floor(distance * FUEL_PRICE_PER_KM * fuelEfficiencyMultiplier);

        // Simple income calculation: passengers * ticketPrice (assuming full flight for now)
        // Deduct fuel cost upfront or at the end. Let's do it at the end to allow net income calculation.
        const grossIncome = Math.floor(capacity * ticketPrice);
        const netIncome = grossIncome - fuelCost;

        set((state) => ({
          planes: state.planes.map(p => {
            if (p.id !== planeId) return p;
            return {
              ...p,
              status: 'flying',
              route: {
                destinationAirportId: destinationId,
                distance,
                progress: 0,
                departureTime: now,
                estimatedArrivalTime: now + durationMs,
                income: netIncome
              }
            };
          })
        }));
        return true;
      },

      processOfflineProgress: () => {
        const state = get();
        const now = Date.now();
        let addedMoney = 0;
        const newLogs: FlightLog[] = [];

        const updatedPlanes = state.planes.map(plane => {
          if (plane.status === 'flying' && plane.route) {
            if (now >= plane.route.estimatedArrivalTime) {
              // Flight finished
              addedMoney += plane.route.income;
              newLogs.push({
                id: Math.random().toString(36).substring(7),
                planeId: plane.id,
                planeName: plane.name,
                from: plane.currentAirportId,
                to: plane.route.destinationAirportId,
                income: plane.route.income,
                timestamp: plane.route.estimatedArrivalTime
              });

              // Degrade condition based on distance flown (roughly 1% per 500km)
              const conditionDegradation = Math.min(plane.condition, plane.route.distance / 500);
              const newCondition = Math.max(0, plane.condition - conditionDegradation);

              return {
                ...plane,
                status: 'idle',
                currentAirportId: plane.route.destinationAirportId,
                condition: newCondition,
                route: undefined
              } as OwnedPlane;
            } else {
              // Flight still in progress, update progress distance
              const model = PLANE_MODELS.find(m => m.id === plane.modelId);
              const speed = (model?.baseSpeed || 500) * (1 + (plane.engineLevel - 1) * 0.1);
              const timeElapsedMs = now - plane.route.departureTime;
              const timeElapsedHours = timeElapsedMs / 3600000;
              const currentProgress = timeElapsedHours * speed;

              return {
                ...plane,
                route: {
                  ...plane.route,
                  progress: Math.min(currentProgress, plane.route.distance)
                }
              };
            }
          }
          return plane;
        });

        set({
          planes: updatedPlanes,
          money: state.money + addedMoney,
          logs: [...newLogs, ...state.logs].slice(0, 50), // keep last 50 logs
          lastSaved: now
        });
      },

      gameTick: () => {
        get().processOfflineProgress();
      },

      addMoney: (amount) => set((state) => ({ money: state.money + amount })),
    }),
    {
      name: 'airline-tycoon-storage',
    }
  )
);
