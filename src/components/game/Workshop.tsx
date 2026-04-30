'use client';

import { MAX_UPGRADE_LEVEL, useGameStore } from '@/store/useGameStore';
import { PLANE_MODELS } from '@/data/planes';
import { Wrench, Zap, Users, Fuel, Sofa, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

const getUpgradeCost = (level: number, type: 'engine' | 'capacity' | 'fuelEfficiency' | 'comfort') => {
  const base = { engine: 10000, capacity: 15000, fuelEfficiency: 8000, comfort: 12000 }[type];
  return Math.floor(base * Math.pow(1.3, Math.max(0, level - 1)));
};

export default function Workshop() {
  const { money, planes, upgradePlane, maintainPlane, overhaulPlane, refurbishPlane } = useGameStore();

  const handle = (ok: boolean, success: string, fail: string) => alert(ok ? success : fail);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workshop Command Center</h1>
        <div className="text-xl font-bold text-green-600">Balance: ${money.toLocaleString()}</div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-indigo-700 text-sm">
        Sistem bengkel sudah di-upgrade: ada Quick Repair, Full Overhaul, dan Refurbish Cabin+Fuel untuk dorong performa armada.
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
              <div className="flex justify-between items-start mb-4 border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold">{plane.name}</h3>
                  <p className="text-gray-500">{model.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${plane.status === 'flying' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{plane.status.toUpperCase()}</span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <p>Engine Lv {plane.engineLevel}/{MAX_UPGRADE_LEVEL}</p>
                  <p>Capacity Lv {plane.capacityLevel}/{MAX_UPGRADE_LEVEL}</p>
                  <p>Fuel Lv {plane.fuelEfficiencyLevel}/{MAX_UPGRADE_LEVEL}</p>
                  <p>Comfort Lv {plane.comfortLevel}/{MAX_UPGRADE_LEVEL}</p>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                  <div className="flex items-center gap-3"><ShieldAlert size={18} className="text-red-600" /><div><p className="font-medium text-red-900">Quick Repair</p><p className="text-sm text-red-700">Condition: {Math.round(plane.condition)}%</p></div></div>
                  <button onClick={() => handle(maintainPlane(plane.id), 'Quick repair completed!', 'Quick repair gagal.')} disabled={plane.condition >= 100 || plane.status !== 'idle'} className="px-3 py-2 bg-red-600 text-white rounded disabled:bg-gray-300 text-sm">${Math.floor((100 - plane.condition) * 500).toLocaleString()}</button>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-3"><Wrench size={18} className="text-amber-600" /><div><p className="font-medium text-amber-900">Full Overhaul</p><p className="text-sm text-amber-700">100% condition with premium parts</p></div></div>
                  <button onClick={() => handle(overhaulPlane(plane.id), 'Full overhaul selesai!', 'Overhaul gagal.')} disabled={plane.condition >= 100 || plane.status !== 'idle'} className="px-3 py-2 bg-amber-600 text-white rounded disabled:bg-gray-300 text-sm">${Math.floor((100 - plane.condition) * 800).toLocaleString()}</button>
                </div>

                <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="flex items-center gap-3"><Sparkles size={18} className="text-indigo-600" /><div><p className="font-medium text-indigo-900">Refurbish Package</p><p className="text-sm text-indigo-700">+Comfort & +Fuel level (cap {MAX_UPGRADE_LEVEL})</p></div></div>
                  <button onClick={() => handle(refurbishPlane(plane.id), 'Refurbish package applied!', 'Refurbish gagal.')} disabled={plane.status !== 'idle'} className="px-3 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-300 text-sm">$75,000</button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button onClick={() => handle(upgradePlane(plane.id, 'engine'), 'Engine upgraded!', 'Engine max / dana kurang.')} disabled={plane.engineLevel >= MAX_UPGRADE_LEVEL || plane.status !== 'idle'} className="p-3 bg-gray-100 rounded text-left hover:bg-gray-200 disabled:bg-gray-50"><Zap size={16} className="mb-1" />Engine · ${engineCost.toLocaleString()}</button>
                  <button onClick={() => handle(upgradePlane(plane.id, 'capacity'), 'Capacity upgraded!', 'Capacity max / dana kurang.')} disabled={plane.capacityLevel >= MAX_UPGRADE_LEVEL || plane.status !== 'idle'} className="p-3 bg-gray-100 rounded text-left hover:bg-gray-200 disabled:bg-gray-50"><Users size={16} className="mb-1" />Seat · ${capacityCost.toLocaleString()}</button>
                  <button onClick={() => handle(upgradePlane(plane.id, 'fuelEfficiency'), 'Fuel upgraded!', 'Fuel max / dana kurang.')} disabled={plane.fuelEfficiencyLevel >= MAX_UPGRADE_LEVEL || plane.status !== 'idle'} className="p-3 bg-gray-100 rounded text-left hover:bg-gray-200 disabled:bg-gray-50"><Fuel size={16} className="mb-1" />Fuel · ${fuelCost.toLocaleString()}</button>
                  <button onClick={() => handle(upgradePlane(plane.id, 'comfort'), 'Comfort upgraded!', 'Comfort max / dana kurang.')} disabled={plane.comfortLevel >= MAX_UPGRADE_LEVEL || plane.status !== 'idle'} className="p-3 bg-gray-100 rounded text-left hover:bg-gray-200 disabled:bg-gray-50"><Sofa size={16} className="mb-1" />Cabin · ${comfortCost.toLocaleString()}</button>
                </div>

                {isMaxed && <p className="text-xs text-emerald-600 flex items-center gap-1"><TrendingUp size={14} />Pesawat ini sudah max-upgrade.</p>}
              </div>
            </div>
          );
        })}

        {planes.length === 0 && (
          <div className="col-span-full p-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <Wrench size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600">No planes in fleet</h3>
            <p className="text-gray-500 mt-2">Buy a plane from the shop to upgrade it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
