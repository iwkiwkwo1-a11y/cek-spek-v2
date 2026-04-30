'use client';

import { useGameStore } from '@/store/useGameStore';
import { PLANE_MODELS } from '@/data/planes';
import { Wrench, Zap, Users, Fuel, Sofa, ShieldAlert } from 'lucide-react';

export default function Workshop() {
  const { money, planes, upgradePlane, maintainPlane } = useGameStore();

  const handleUpgrade = (planeId: string, type: 'engine' | 'capacity' | 'fuelEfficiency' | 'comfort') => {
    if (upgradePlane(planeId, type)) {
      alert('Upgrade successful!');
    } else {
      alert('Not enough money!');
    }
  };

  const handleMaintenance = (planeId: string) => {
    if (maintainPlane(planeId)) {
      alert('Plane successfully maintained!');
    } else {
      alert('Cannot perform maintenance! Check your balance or if the plane is currently flying.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workshop & Upgrades</h1>
        <div className="text-xl font-bold text-green-600">
          Balance: ${money.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {planes.map(plane => {
          const model = PLANE_MODELS.find(m => m.id === plane.modelId);
          if (!model) return null;

          return (
            <div key={plane.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-6 border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold">{plane.name}</h3>
                  <p className="text-gray-500">{model.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  plane.status === 'flying' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {plane.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4">

                {/* Maintenance */}
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${plane.condition < 30 ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'}`}>
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-red-900">Maintenance & Repair</p>
                      <p className="text-sm text-red-700">Condition: {Math.round(plane.condition)}%</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMaintenance(plane.id)}
                    disabled={plane.condition >= 100 || plane.status !== 'idle'}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Repair (${Math.floor((100 - plane.condition) * 500).toLocaleString()})
                  </button>
                </div>

                {/* Engine Upgrade */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded">
                      <Zap size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Engine Upgrade</p>
                      <p className="text-sm text-gray-500">Lvl {plane.engineLevel} (+10% Speed)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpgrade(plane.id, 'engine')}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors text-sm"
                  >
                    $10,000
                  </button>
                </div>

                {/* Capacity Upgrade */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Seat Capacity</p>
                      <p className="text-sm text-gray-500">Lvl {plane.capacityLevel} (+20% Seats)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpgrade(plane.id, 'capacity')}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors text-sm"
                  >
                    $15,000
                  </button>
                </div>

                {/* Fuel Efficiency Upgrade */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded">
                      <Fuel size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Fuel Efficiency</p>
                      <p className="text-sm text-gray-500">Lvl {plane.fuelEfficiencyLevel} (+15% Efficiency)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpgrade(plane.id, 'fuelEfficiency')}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors text-sm"
                  >
                    $8,000
                  </button>
                </div>

                {/* Comfort Upgrade */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded">
                      <Sofa size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Comfort & Class</p>
                      <p className="text-sm text-gray-500">Lvl {plane.comfortLevel} (Enables higher ticket prices)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpgrade(plane.id, 'comfort')}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors text-sm"
                  >
                    $12,000
                  </button>
                </div>

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
