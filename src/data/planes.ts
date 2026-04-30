export interface PlaneModel {
  id: string;
  name: string;
  price: number;
  baseSpeed: number; // km/h
  baseCapacity: number; // total seats
  baseFuelEfficiency: number; // arbitrary score
}

export const PLANE_MODELS: PlaneModel[] = [
  { id: 'cessna_172', name: 'Air Taxi (Cessna)', price: 50000, baseSpeed: 220, baseCapacity: 4, baseFuelEfficiency: 5 },
  { id: 'atr_72', name: 'Regional Prop (ATR)', price: 500000, baseSpeed: 500, baseCapacity: 70, baseFuelEfficiency: 15 },
  { id: 'b737', name: 'Narrow Body (B737)', price: 2000000, baseSpeed: 840, baseCapacity: 160, baseFuelEfficiency: 40 },
  { id: 'a320', name: 'Narrow Body (A320)', price: 2100000, baseSpeed: 830, baseCapacity: 180, baseFuelEfficiency: 45 },
  { id: 'b777', name: 'Wide Body (B777)', price: 10000000, baseSpeed: 900, baseCapacity: 350, baseFuelEfficiency: 80 },
  { id: 'a380', name: 'Jumbo Jet (A380)', price: 25000000, baseSpeed: 900, baseCapacity: 500, baseFuelEfficiency: 100 },
];
