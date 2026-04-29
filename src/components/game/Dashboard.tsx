'use client';

import { useGameStore } from '@/store/useGameStore';
import { Plane, DollarSign, Activity, Clock } from 'lucide-react';

export default function Dashboard() {
  const { money, companyName, planes, logs } = useGameStore();

  const activeFlights = planes.filter(p => p.status === 'flying').length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{companyName} Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Balance</p>
              <p className="text-2xl font-bold">${money.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Plane size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Fleet Size</p>
              <p className="text-2xl font-bold">{planes.length} Planes</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Flights</p>
              <p className="text-2xl font-bold">{activeFlights}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock size={20} /> Recent Logs
        </h2>
        <div className="space-y-4">
          {logs.length === 0 ? (
            <p className="text-gray-500 italic">No recent activity.</p>
          ) : (
            logs.slice(0, 5).map(log => (
              <div key={log.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{log.planeName} landed.</p>
                  <p className="text-sm text-gray-500">{log.from} &rarr; {log.to}</p>
                </div>
                <div className="text-green-600 font-bold">
                  +${log.income.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
