'use client';

import { useState } from 'react';
import { MAX_UPGRADE_LEVEL, useGameStore } from '@/store/useGameStore';
import { PLANE_MODELS } from '@/data/planes';
import { Wrench, Zap, Users, Fuel, Sofa, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { GameToast } from './ui-toast';

const getUpgradeCost = (level: number, type: 'engine' | 'capacity' | 'fuelEfficiency' | 'comfort') => {
  const base = { engine: 10000, capacity: 15000, fuelEfficiency: 8000, comfort: 12000 }[type];
  return Math.floor(base * Math.pow(1.3, Math.max(0, level - 1)));
};

export default function Workshop() {
  const { money, planes, emergencyFund, upgradePlane, maintainPlane, overhaulPlane, refurbishPlane, applyEmergencyFund } = useGameStore();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const handle = (ok: boolean, success: string, fail: string) => setToast({ message: ok ? success : fail, type: ok ? 'success' : 'error' });

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Workshop Command Center</h1>
          <div className="text-right">
            <div className="text-xl font-bold text-green-600">Balance: ${money.toLocaleString()}</div>
            <div className="text-sm font-semibold text-cyan-600">Emergency Fund: ${emergencyFund.toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {planes.map((plane) => {
            const model = PLANE_MODELS.find(m => m.id === plane.modelId);
            if (!model) return null;
            const engineCost = getUpgradeCost(plane.engineLevel, 'engine');
            const capacityCost = getUpgradeCost(plane.capacityLevel, 'capacity');
            const fuelCost = getUpgradeCost(plane.fuelEfficiencyLevel, 'fuelEfficiency');
            const comfortCost = getUpgradeCost(plane.comfortLevel, 'comfort');
            const isMaxed = plane.engineLevel >= MAX_UPGRADE_LEVEL && plane.capacityLevel >= MAX_UPGRADE_LEVEL && plane.fuelEfficiencyLevel >= MAX_UPGRADE_LEVEL && plane.comfortLevel >= MAX_UPGRADE_LEVEL;

            return (
              <div key={plane.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold">{plane.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{model.name}</p>
                <div className="space-y-2">
                  <button onClick={() => handle(maintainPlane(plane.id), 'Quick repair completed!', 'Quick repair gagal.')} className="w-full p-2 bg-red-50 rounded text-left"><ShieldAlert size={16} className="inline mr-2" />Quick Repair</button>
                  <button onClick={() => handle(overhaulPlane(plane.id), 'Full overhaul selesai!', 'Overhaul gagal.')} className="w-full p-2 bg-amber-50 rounded text-left"><Wrench size={16} className="inline mr-2" />Full Overhaul</button>
                  <button onClick={() => handle(refurbishPlane(plane.id), 'Refurbish package applied!', 'Refurbish gagal.')} className="w-full p-2 bg-indigo-50 rounded text-left"><Sparkles size={16} className="inline mr-2" />Refurbish</button>
                  <button onClick={() => handle(applyEmergencyFund(plane.id), 'Emergency fund dipakai!', 'Dana darurat tidak cukup / pesawat tidak eligible.')} className="w-full p-2 bg-cyan-50 rounded text-left"><ShieldAlert size={16} className="inline mr-2" />Emergency Boost</button>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button onClick={() => handle(upgradePlane(plane.id, 'engine'), 'Engine upgraded!', 'Engine max / dana kurang.')} className="p-2 bg-gray-100 rounded text-left"><Zap size={14} className="inline mr-1"/>${engineCost.toLocaleString()}</button>
                    <button onClick={() => handle(upgradePlane(plane.id, 'capacity'), 'Capacity upgraded!', 'Capacity max / dana kurang.')} className="p-2 bg-gray-100 rounded text-left"><Users size={14} className="inline mr-1"/>${capacityCost.toLocaleString()}</button>
                    <button onClick={() => handle(upgradePlane(plane.id, 'fuelEfficiency'), 'Fuel upgraded!', 'Fuel max / dana kurang.')} className="p-2 bg-gray-100 rounded text-left"><Fuel size={14} className="inline mr-1"/>${fuelCost.toLocaleString()}</button>
                    <button onClick={() => handle(upgradePlane(plane.id, 'comfort'), 'Comfort upgraded!', 'Comfort max / dana kurang.')} className="p-2 bg-gray-100 rounded text-left"><Sofa size={14} className="inline mr-1"/>${comfortCost.toLocaleString()}</button>
                  </div>
                  {isMaxed && <p className="text-xs text-emerald-600"><TrendingUp size={12} className="inline mr-1"/>Maxed</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {toast && <GameToast message={toast.message} type={toast.type} />}
    </>
  );
}
