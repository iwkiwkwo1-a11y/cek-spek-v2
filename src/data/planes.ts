export interface PlaneModel {
  id: string;
  name: string;
  price: number;
  baseSpeed: number; // km/h
  baseCapacity: number; // total seats
  baseFuelEfficiency: number; // arbitrary score
}

export const PLANE_MODELS: PlaneModel[] = [
  { id: 'cessna_172', name: 'Cessna 172 Skyhawk', price: 50000, baseSpeed: 220, baseCapacity: 4, baseFuelEfficiency: 5 },
  { id: 'atr_72', name: 'ATR 72-600', price: 500000, baseSpeed: 500, baseCapacity: 70, baseFuelEfficiency: 15 },
  { id: 'dhc8_q400', name: 'De Havilland Dash 8 Q400', price: 650000, baseSpeed: 660, baseCapacity: 82, baseFuelEfficiency: 18 },
  { id: 'e175', name: 'Embraer E175', price: 1400000, baseSpeed: 830, baseCapacity: 88, baseFuelEfficiency: 26 },
  { id: 'a220_300', name: 'Airbus A220-300', price: 1800000, baseSpeed: 871, baseCapacity: 145, baseFuelEfficiency: 35 },
  { id: 'b737', name: 'Boeing 737-800', price: 2000000, baseSpeed: 840, baseCapacity: 160, baseFuelEfficiency: 40 },
  { id: 'a320', name: 'Airbus A320neo', price: 2100000, baseSpeed: 830, baseCapacity: 180, baseFuelEfficiency: 45 },
  { id: 'b737_max8', name: 'Boeing 737 MAX 8', price: 2400000, baseSpeed: 839, baseCapacity: 189, baseFuelEfficiency: 50 },
  { id: 'a321neo', name: 'Airbus A321neo', price: 2900000, baseSpeed: 870, baseCapacity: 220, baseFuelEfficiency: 58 },
  { id: 'b787_9', name: 'Boeing 787-9 Dreamliner', price: 6800000, baseSpeed: 903, baseCapacity: 296, baseFuelEfficiency: 72 },
  { id: 'a350_900', name: 'Airbus A350-900', price: 7600000, baseSpeed: 905, baseCapacity: 325, baseFuelEfficiency: 78 },
  { id: 'b777', name: 'Boeing 777-300ER', price: 10000000, baseSpeed: 900, baseCapacity: 350, baseFuelEfficiency: 80 },
  { id: 'b747_8', name: 'Boeing 747-8 Intercontinental', price: 16000000, baseSpeed: 917, baseCapacity: 410, baseFuelEfficiency: 92 },
  { id: 'a380', name: 'Airbus A380-800', price: 25000000, baseSpeed: 900, baseCapacity: 500, baseFuelEfficiency: 100 },
];
