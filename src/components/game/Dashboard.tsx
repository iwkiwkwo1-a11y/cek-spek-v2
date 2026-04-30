'use client';

import { useGameStore } from '@/store/useGameStore';
import { Plane, DollarSign, Activity, Clock } from 'lucide-react';
import { AIRPORTS } from '@/data/airports';

export default function Dashboard() {
  const { money, companyName, planes, logs, timeMultiplier, setTimeMultiplier } = useGameStore();

  const activeFlights = planes.filter(p => p.status === 'flying').length;
  const activeFlightDetails = planes.filter(p => p.status === 'flying' && p.route);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{companyName} Dashboard</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <p className="text-sm text-gray-500 mb-3">Simulation Speed</p>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((speed) => (
            <button
              key={speed}
              onClick={() => setTimeMultiplier(speed as 1 | 2 | 3 | 4 | 5)}
              className={`px-3 py-2 rounded-lg border text-sm font-semibold ${
                timeMultiplier === speed
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

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
        <h2 className="text-xl font-bold mb-4">Live Flights</h2>
        <div className="space-y-4">
          {activeFlightDetails.length === 0 ? (
            <p className="text-gray-500 italic">No flights in the air right now.</p>
          ) : (
            activeFlightDetails.map((plane) => {
              const from = AIRPORTS.find((a) => a.id === plane.currentAirportId);
              const to = AIRPORTS.find((a) => a.id === plane.route?.destinationAirportId);
              const progressRatio = plane.route ? Math.min(plane.route.progress / plane.route.distance, 1) : 0;
              const remainingMinutes = plane.route
                ? Math.max(
                    0,
                    Math.round(
                      ((plane.route.distance - plane.route.progress) /
                        (plane.route.distance / ((plane.route.estimatedArrivalTime - plane.route.departureTime) / 3600000))) *
                        (60 / timeMultiplier)
                    )
                  )
                : 0;

              return (
                <div key={plane.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">{plane.name}</p>
                    <p className="text-sm text-gray-500">Condition: {plane.condition.toFixed(0)}%</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {from?.id} → {to?.id} · ETA ~{remainingMinutes} min ({timeMultiplier}x)
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progressRatio * 100}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{Math.round(progressRatio * 100)}% completed</p>
                </div>
              );
            })
          )}
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
