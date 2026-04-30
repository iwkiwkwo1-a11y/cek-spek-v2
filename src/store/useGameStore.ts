import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIRPORTS } from '../data/airports';
import { PLANE_MODELS } from '../data/planes';

export interface OwnedPlane {
  id: string;
  modelId: string;
  name: string;
  engineLevel: number;
  capacityLevel: number;
  fuelEfficiencyLevel: number;
  comfortLevel: number;
  condition: number;
  status: 'idle' | 'flying' | 'maintenance';
  currentAirportId: string;
  route?: {
    destinationAirportId: string;
    distance: number;
    progress: number;
    departureTime: number;
    estimatedArrivalTime: number;
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

export const MAX_UPGRADE_LEVEL = 6;

interface GameState {
  money: number;
  companyName: string;
  planes: OwnedPlane[];
  logs: FlightLog[];
  lastSaved: number;
  gameHoursElapsed: number;
  setCompanyName: (name: string) => void;
  buyPlane: (modelId: string) => boolean;
  upgradePlane: (planeId: string, upgradeType: 'engine' | 'capacity' | 'fuelEfficiency' | 'comfort') => boolean;
  maintainPlane: (planeId: string) => boolean;
  overhaullPlane: (planeId: string) => boolean;
  refurbishPlane: (planeId: string) => boolean;
  assignRoute: (planeId: string, destinationId: string, ticketPrice: number) => boolean;
  processOfflineProgress: () => void;
  gameTick: () => void;
  addMoney: (amount: number) => void;
}

const REAL_SECONDS_TO_GAME_HOURS = 1;

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

const UPGRADE_BASE_COSTS = {
  engine: 10000,
  capacity: 15000,
  fuelEfficiency: 8000,
  comfort: 12000,
};

const FUEL_PRICE_PER_KM = 2;
const MAINTENANCE_COST_PER_PERCENT = 500;

const getUpgradeCost = (level: number, upgradeType: 'engine' | 'capacity' | 'fuelEfficiency' | 'comfort') => {
  const base = UPGRADE_BASE_COSTS[upgradeType];
  return Math.floor(base * Math.pow(1.3, Math.max(0, level - 1)));
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      money: 1000000,
      companyName: 'My Airline',
      planes: [],
      logs: [],
      lastSaved: Date.now(),
      gameHoursElapsed: 0,

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
          currentAirportId: 'CGK',
        };

        set({
          money: state.money - model.price,
          planes: [...state.planes, newPlane],
        });
        return true;
      },

      upgradePlane: (planeId, upgradeType) => {
        const state = get();
        const plane = state.planes.find(p => p.id === planeId);
        if (!plane || plane.status !== 'idle') return false;

        const currentLevel = upgradeType === 'engine'
          ? plane.engineLevel
          : upgradeType === 'capacity'
            ? plane.capacityLevel
            : upgradeType === 'fuelEfficiency'
              ? plane.fuelEfficiencyLevel
              : plane.comfortLevel;

        if (currentLevel >= MAX_UPGRADE_LEVEL) return false;

        const cost = getUpgradeCost(currentLevel, upgradeType);
        if (state.money < cost) return false;

        set((currentState) => ({
          money: currentState.money - cost,
          planes: currentState.planes.map((p) => {
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

        set((currentState) => ({
          money: currentState.money - cost,
          planes: currentState.planes.map(p => p.id === planeId ? { ...p, condition: 100 } : p)
        }));
        return true;
      },

      overhaullPlane: (planeId) => {
        const state = get();
        const plane = state.planes.find(p => p.id === planeId);
        if (!plane || plane.status !== 'idle' || plane.condition >= 100) return false;

        const cost = Math.floor((100 - plane.condition) * 800);
        if (state.money < cost) return false;

        set((currentState) => ({
          money: currentState.money - cost,
          planes: currentState.planes.map(p => p.id === planeId ? { ...p, condition: 100 } : p)
        }));
        return true;
      },

      refurbishPlane: (planeId) => {
        const state = get();
        const plane = state.planes.find(p => p.id === planeId);
        if (!plane || plane.status !== 'idle') return false;

        const cost = 75000;
        if (state.money < cost) return false;

        set((currentState) => ({
          money: currentState.money - cost,
          planes: currentState.planes.map((p) => p.id !== planeId ? p : ({
            ...p,
            condition: Math.min(100, p.condition + 15),
            comfortLevel: Math.min(MAX_UPGRADE_LEVEL, p.comfortLevel + 1),
            fuelEfficiencyLevel: Math.min(MAX_UPGRADE_LEVEL, p.fuelEfficiencyLevel + 1),
          }))
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
        if (!model || plane.condition < 10) return false;

        const distance = calculateDistance(fromAirport.lat, fromAirport.lng, toAirport.lat, toAirport.lng);
        const speed = model.baseSpeed * (1 + (plane.engineLevel - 1) * 0.1);
        const durationHours = distance / speed;
        const durationMs = (durationHours / REAL_SECONDS_TO_GAME_HOURS) * 1000;

        const now = Date.now();
        const capacity = model.baseCapacity * (1 + (plane.capacityLevel - 1) * 0.2);
        const fuelEfficiencyMultiplier = 1 / (1 + (plane.fuelEfficiencyLevel - 1) * 0.15);
        const fuelCost = Math.floor(distance * FUEL_PRICE_PER_KM * fuelEfficiencyMultiplier);
        const grossIncome = Math.floor(capacity * ticketPrice);
        const netIncome = grossIncome - fuelCost;

        set((currentState) => ({
          planes: currentState.planes.map(p => p.id !== planeId ? p : {
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
          })
        }));
        return true;
      },

      processOfflineProgress: () => {
        const state = get();
        const now = Date.now();
        const elapsedRealMs = Math.max(0, now - state.lastSaved);
        const effectiveElapsedHours = (elapsedRealMs / 1000) * REAL_SECONDS_TO_GAME_HOURS;

        let addedMoney = 0;
        const newLogs: FlightLog[] = [];

        const updatedPlanes = state.planes.map((plane) => {
          if (plane.status !== 'flying' || !plane.route) return plane;

          const model = PLANE_MODELS.find(m => m.id === plane.modelId);
          const speed = (model?.baseSpeed || 500) * (1 + (plane.engineLevel - 1) * 0.1);
          const addedProgress = speed * effectiveElapsedHours;
          const currentProgress = plane.route.progress + addedProgress;

          if (currentProgress >= plane.route.distance) {
            addedMoney += plane.route.income;
            newLogs.push({
              id: Math.random().toString(36).substring(7),
              planeId: plane.id,
              planeName: plane.name,
              from: plane.currentAirportId,
              to: plane.route.destinationAirportId,
              income: plane.route.income,
              timestamp: now
            });

            const conditionDegradation = Math.min(plane.condition, plane.route.distance / 500);
            return {
              ...plane,
              status: 'idle',
              currentAirportId: plane.route.destinationAirportId,
              condition: Math.max(0, plane.condition - conditionDegradation),
              route: undefined
            } as OwnedPlane;
          }

          return {
            ...plane,
            route: {
              ...plane.route,
              progress: Math.min(currentProgress, plane.route.distance)
            }
          };
        });

        set({
          planes: updatedPlanes,
          money: state.money + addedMoney,
          logs: [...newLogs, ...state.logs].slice(0, 50),
          lastSaved: now,
          gameHoursElapsed: state.gameHoursElapsed + effectiveElapsedHours,
        });
      },

      gameTick: () => get().processOfflineProgress(),
      addMoney: (amount) => set((state) => ({ money: state.money + amount })),
    }),
    { name: 'airline-tycoon-storage' }
  )
);
