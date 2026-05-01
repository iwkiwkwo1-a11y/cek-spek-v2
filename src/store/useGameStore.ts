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
  playerName: string;
  playerSkill: "operations" | "finance" | "engineering" | "marketing" | "";
  planes: OwnedPlane[];
  logs: FlightLog[];
  lastSaved: number;
  gameHoursElapsed: number;
  completedFlights: number;
  reputation: number;
  emergencyFund: number;
  autoDispatchEnabled: boolean;
  autoTicketPrice: number;
  autoRepairEnabled: boolean;
  autoRepairThreshold: number;
  claimedMilestones: number[];
  isPaused: boolean;
  bailoutUsed: boolean;
  setCompanyName: (name: string) => void;
  initializeProfile: (playerName: string, companyName: string, playerSkill: "operations" | "finance" | "engineering" | "marketing") => void;
  buyPlane: (modelId: string) => boolean;
  upgradePlane: (planeId: string, upgradeType: 'engine' | 'capacity' | 'fuelEfficiency' | 'comfort') => boolean;
  maintainPlane: (planeId: string) => boolean;
  overhaulPlane: (planeId: string) => boolean;
  refurbishPlane: (planeId: string) => boolean;
  assignRoute: (planeId: string, destinationId: string, ticketPrice: number) => boolean;
  processOfflineProgress: () => void;
  gameTick: () => void;
  addMoney: (amount: number) => void;
  applyEmergencyFund: (planeId: string) => boolean;
  setAutoDispatch: (enabled: boolean) => void;
  setAutoTicketPrice: (price: number) => void;
  setAutoRepair: (enabled: boolean) => void;
  setAutoRepairThreshold: (threshold: number) => void;
  claimMilestoneReward: (targetFlights: number) => boolean;
  setPaused: (paused: boolean) => void;
  requestBailout: () => boolean;
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
      playerName: '',
      playerSkill: '',
      planes: [],
      logs: [],
      lastSaved: Date.now(),
      gameHoursElapsed: 0,
      completedFlights: 0,
      reputation: 50,
      emergencyFund: 0,
      autoDispatchEnabled: false,
      autoTicketPrice: 500,
      autoRepairEnabled: false,
      autoRepairThreshold: 65,
      claimedMilestones: [],
      isPaused: false,
      bailoutUsed: false,

      setCompanyName: (name) => set({ companyName: name }),
      setAutoDispatch: (enabled) => set({ autoDispatchEnabled: enabled }),
      setAutoTicketPrice: (price) => set({ autoTicketPrice: Math.max(50, price) }),
      setAutoRepair: (enabled) => set({ autoRepairEnabled: enabled }),
      setAutoRepairThreshold: (threshold) => set({ autoRepairThreshold: Math.max(30, Math.min(95, threshold)) }),
      initializeProfile: (playerName, companyName, playerSkill) => set({ playerName, companyName, playerSkill }),

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

        const skillDiscount = state.playerSkill === "engineering" ? 0.9 : 1;
        const cost = Math.floor(getUpgradeCost(currentLevel, upgradeType) * skillDiscount);
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
        const maintenanceDiscount = state.playerSkill === "engineering" ? 0.85 : 1;
        const cost = Math.floor(damage * MAINTENANCE_COST_PER_PERCENT * maintenanceDiscount);
        if (state.money < cost) return false;

        set((currentState) => ({
          money: currentState.money - cost,
          planes: currentState.planes.map(p => p.id === planeId ? { ...p, condition: 100 } : p)
        }));
        return true;
      },

      overhaulPlane: (planeId) => {
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
        const skillRevenueBonus = state.playerSkill === "marketing" ? 1.12 : state.playerSkill === "finance" ? 1.06 : 1;
        const operationsEfficiency = state.playerSkill === "operations" ? 0.9 : 1;
        const fuelCost = Math.floor(distance * FUEL_PRICE_PER_KM * fuelEfficiencyMultiplier * operationsEfficiency);
        const safeReputation = Number.isFinite(state.reputation) ? state.reputation : 50;
        const comfortBonus = 1 + (plane.comfortLevel - 1) * 0.05;
        const conditionPenalty = Math.max(0.75, plane.condition / 100);
        const demandFactor = comfortBonus * conditionPenalty * (0.8 + safeReputation / 250);
        const grossIncome = Math.floor(capacity * ticketPrice * demandFactor * skillRevenueBonus);
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
        const safeLastSaved = Number.isFinite(state.lastSaved) ? state.lastSaved : now;
        const elapsedRealMs = Math.max(0, now - safeLastSaved);
        const effectiveElapsedHours = (elapsedRealMs / 1000) * REAL_SECONDS_TO_GAME_HOURS;

        let addedMoney = 0;
        let emergencyFundGain = 0;
        let completedFlights = 0;
        let reputationDelta = 0;
        const newLogs: FlightLog[] = [];

        const updatedPlanes = state.planes.map((plane) => {
          if (plane.status !== 'flying' || !plane.route) return plane;

          const model = PLANE_MODELS.find(m => m.id === plane.modelId);
          const speed = (model?.baseSpeed || 500) * (1 + (plane.engineLevel - 1) * 0.1);
          const addedProgress = speed * effectiveElapsedHours;
          const currentProgress = plane.route.progress + addedProgress;

          if (currentProgress >= plane.route.distance) {
            const emergencyContribution = Math.max(0, Math.floor(plane.route.income * 0.02));
            emergencyFundGain += emergencyContribution;
            addedMoney += plane.route.income - emergencyContribution;
            newLogs.push({
              id: Math.random().toString(36).substring(7),
              planeId: plane.id,
              planeName: plane.name,
              from: plane.currentAirportId,
              to: plane.route.destinationAirportId,
              income: plane.route.income,
              timestamp: now
            });

            const conditionDegradation = Math.min(plane.condition, plane.route.distance / 1500);
            completedFlights += 1;
            reputationDelta += plane.condition > 70 ? 0.2 : -0.25;
            if (state.playerSkill === "operations") reputationDelta += 0.05;
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
          gameHoursElapsed: (Number.isFinite(state.gameHoursElapsed) ? state.gameHoursElapsed : 0) + effectiveElapsedHours,
          completedFlights: (Number.isFinite(state.completedFlights) ? state.completedFlights : 0) + completedFlights,
          reputation: Math.max(0, Math.min(100, (Number.isFinite(state.reputation) ? state.reputation : 50) + reputationDelta)),
          emergencyFund: (Number.isFinite(state.emergencyFund) ? state.emergencyFund : 0) + emergencyFundGain,
        });
      },


      setPaused: (paused) => set({ isPaused: paused }),

      requestBailout: () => {
        const state = get();
        if (state.bailoutUsed) return false;
        if (state.money > 0) return false;

        set((currentState) => ({
          money: currentState.money + 500000,
          reputation: Math.max(0, currentState.reputation - 10),
          bailoutUsed: true,
        }));
        return true;
      },

      claimMilestoneReward: (targetFlights) => {
        const state = get();
        if (state.claimedMilestones.includes(targetFlights)) return false;
        if (state.completedFlights < targetFlights) return false;

        const reward = targetFlights * 1200;
        set((currentState) => ({
          money: currentState.money + reward,
          reputation: Math.min(100, currentState.reputation + 1.5),
          claimedMilestones: [...currentState.claimedMilestones, targetFlights],
        }));
        return true;
      },

      gameTick: () => {
        const state = get();
        if (state.isPaused) return;
        state.processOfflineProgress();

        if (!state.autoDispatchEnabled) return;
        const refreshed = get();

        if (refreshed.autoRepairEnabled) {
          refreshed.planes
            .filter((p) => p.status === "idle" && p.condition < refreshed.autoRepairThreshold)
            .forEach((p) => {
              refreshed.maintainPlane(p.id);
            });
        }

        const idlePlanes = refreshed.planes.filter((p) => p.status === "idle");

        idlePlanes.forEach((plane) => {
          const options = AIRPORTS.filter((a) => a.id !== plane.currentAirportId);
          const next = options[Math.floor(Math.random() * options.length)];
          if (next) {
            refreshed.assignRoute(plane.id, next.id, refreshed.autoTicketPrice);
          }
        });
      },
      addMoney: (amount) => set((state) => ({ money: state.money + amount })),
      applyEmergencyFund: (planeId) => {
        const state = get();
        const plane = state.planes.find(p => p.id === planeId);
        if (!plane || plane.status !== "idle" || plane.condition >= 95) return false;

        const neededPoints = Math.min(25, 100 - plane.condition);
        const cost = Math.floor(neededPoints * 700);
        if (state.emergencyFund < cost) return false;

        set((currentState) => ({
          emergencyFund: currentState.emergencyFund - cost,
          planes: currentState.planes.map((p) => p.id === planeId ? { ...p, condition: Math.min(100, p.condition + neededPoints) } : p),
        }));
        return true;
      },
    }),
    {
      name: 'airline-tycoon-storage',
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<GameState>),
        playerName: (persistedState as Partial<GameState>)?.playerName ?? currentState.playerName,
        playerSkill: (persistedState as Partial<GameState>)?.playerSkill ?? currentState.playerSkill,
        completedFlights: Number.isFinite((persistedState as Partial<GameState>)?.completedFlights) ? (persistedState as Partial<GameState>).completedFlights as number : currentState.completedFlights,
        reputation: Number.isFinite((persistedState as Partial<GameState>)?.reputation) ? (persistedState as Partial<GameState>).reputation as number : currentState.reputation,
        emergencyFund: Number.isFinite((persistedState as Partial<GameState>)?.emergencyFund) ? (persistedState as Partial<GameState>).emergencyFund as number : currentState.emergencyFund,
        autoDispatchEnabled: Boolean((persistedState as Partial<GameState>)?.autoDispatchEnabled),
        autoTicketPrice: Number.isFinite((persistedState as Partial<GameState>)?.autoTicketPrice) ? (persistedState as Partial<GameState>).autoTicketPrice as number : currentState.autoTicketPrice,
        autoRepairEnabled: Boolean((persistedState as Partial<GameState>)?.autoRepairEnabled),
        autoRepairThreshold: Number.isFinite((persistedState as Partial<GameState>)?.autoRepairThreshold) ? (persistedState as Partial<GameState>).autoRepairThreshold as number : currentState.autoRepairThreshold,
        claimedMilestones: Array.isArray((persistedState as Partial<GameState>)?.claimedMilestones) ? (persistedState as Partial<GameState>).claimedMilestones as number[] : currentState.claimedMilestones,
        isPaused: Boolean((persistedState as Partial<GameState>)?.isPaused),
        bailoutUsed: Boolean((persistedState as Partial<GameState>)?.bailoutUsed),
      }),
    }
  )
);
