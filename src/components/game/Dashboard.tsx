'use client';

import { useMemo } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { Plane, DollarSign, Activity, Clock, ShieldAlert, Gauge } from 'lucide-react';
import { AIRPORTS } from '@/data/airports';

export default function Dashboard() {
  const { money, companyName, planes, logs, gameHoursElapsed, completedFlights, reputation, emergencyFund, claimedMilestones, claimMilestoneReward } = useGameStore();

  const activeFlights = planes.filter(p => p.status === 'flying').length;
  const activeFlightDetails = planes.filter(p => p.status === 'flying' && p.route);
  const criticalPlanes = planes.filter((p) => p.condition < 35).length;

  const recentIncome = useMemo(() => logs.slice(0, 5).reduce((sum, log) => sum + log.income, 0), [logs]);

  const averageCondition = useMemo(() => {
    if (planes.length === 0) return 100;
    return planes.reduce((sum, plane) => sum + plane.condition, 0) / planes.length;
  }, [planes]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{companyName} Dashboard</h1>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <p className="text-xs font-bold text-indigo-500 mb-1">VERSION 2.5</p>
        <p className="text-indigo-700 font-semibold">Mega Time Update Active</p>
        <p className="text-sm text-indigo-600 mt-1">1 detik dunia nyata = 1 jam di game. Operasional sekarang jauh lebih cepat.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-8 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600"><DollarSign size={24} /></div>
            <div><p className="text-sm text-gray-500">Balance</p><p className="text-2xl font-bold">${money.toLocaleString()}</p></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Plane size={24} /></div>
            <div><p className="text-sm text-gray-500">Fleet Size</p><p className="text-2xl font-bold">{planes.length}</p></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg text-purple-600"><Activity size={24} /></div>
            <div><p className="text-sm text-gray-500">Active Flights</p><p className="text-2xl font-bold">{activeFlights}</p></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg text-orange-600"><Gauge size={24} /></div>
            <div><p className="text-sm text-gray-500">Avg Condition</p><p className="text-2xl font-bold">{averageCondition.toFixed(0)}%</p></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600"><ShieldAlert size={24} /></div>
            <div><p className="text-sm text-gray-500">Need Maintenance</p><p className="text-2xl font-bold">{criticalPlanes}</p></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600"><DollarSign size={24} /></div>
            <div><p className="text-sm text-gray-500">Recent Revenue</p><p className="text-2xl font-bold">${recentIncome.toLocaleString()}</p></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-100 rounded-lg text-cyan-600"><Activity size={24} /></div>
            <div><p className="text-sm text-gray-500">Completed Flights</p><p className="text-2xl font-bold">{completedFlights}</p></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-100 rounded-lg text-pink-600"><ShieldAlert size={24} /></div>
            <div><p className="text-sm text-gray-500">Reputation</p><p className="text-2xl font-bold">{reputation.toFixed(1)}</p></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-100 rounded-lg text-cyan-600"><DollarSign size={24} /></div>
            <div><p className="text-sm text-gray-500">Emergency Fund</p><p className="text-2xl font-bold">${emergencyFund.toLocaleString()}</p></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4">Live Flights</h2>
        <div className="space-y-4">
          {activeFlightDetails.length === 0 ? <p className="text-gray-500 italic">No flights in the air right now.</p> : activeFlightDetails.map((plane) => {
            const route = plane.route;
            if (!route) return null;
            const from = AIRPORTS.find((a) => a.id === plane.currentAirportId);
            const to = AIRPORTS.find((a) => a.id === route.destinationAirportId);
            const progressRatio = Math.min(route.progress / route.distance, 1);
            const etaGameHours = Math.max(0, ((route.distance - route.progress) / route.distance) * ((route.estimatedArrivalTime - route.departureTime) / 1000));

            return (
              <div key={plane.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{plane.name}</p>
                  <p className="text-sm text-gray-500">Condition: {plane.condition.toFixed(0)}%</p>
                </div>
                <p className="text-sm text-gray-600 mb-2">{from?.id} → {to?.id} · ETA ~{etaGameHours.toFixed(1)} game hours</p>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progressRatio * 100}%` }} /></div>
                <p className="text-xs text-gray-500 mt-2">{Math.round(progressRatio * 100)}% completed</p>
              </div>
            );
          })}
        </div>
      </div>


      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-3">Milestone Rewards v2.5</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[10, 25, 50].map((target) => {
            const claimed = claimedMilestones.includes(target);
            const unlocked = completedFlights >= target;
            return (
              <div key={target} className="border rounded-lg p-3">
                <p className="font-semibold">{target} Flights</p>
                <p className="text-sm text-gray-500 mb-2">Reward: ${(target * 1200).toLocaleString()}</p>
                <button
                  onClick={() => claimMilestoneReward(target)}
                  disabled={!unlocked || claimed}
                  className="w-full py-2 rounded bg-indigo-600 text-white disabled:bg-gray-300"
                >
                  {claimed ? 'Claimed' : unlocked ? 'Claim Reward' : 'Locked'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-3">v2.5 Release Notes</h2>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Skill founder kini memengaruhi ekonomi: marketing/finance boost revenue, operations tekan fuel cost.</li>
          <li>Engineering memberi diskon upgrade + maintenance untuk strategi growth jangka panjang.</li>
          <li>Ritme simulasi tetap 1 detik nyata = 1 jam game untuk gameplay yang lebih dinamis.</li>
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock size={20} /> Recent Logs</h2>
        <p className="text-sm text-gray-500 mb-4">Total in-game time: {gameHoursElapsed.toFixed(1)} jam</p>
        <div className="space-y-4">
          {logs.length === 0 ? <p className="text-gray-500 italic">No recent activity.</p> : logs.slice(0, 7).map(log => (
            <div key={log.id} className="flex justify-between items-center py-2 border-b last:border-0">
              <div><p className="font-medium">{log.planeName} landed.</p><p className="text-sm text-gray-500">{log.from} &rarr; {log.to}</p></div>
              <div className="text-green-600 font-bold">+${log.income.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
