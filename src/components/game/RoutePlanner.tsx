'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { AIRPORTS } from '@/data/airports';
import { Navigation } from 'lucide-react';

export default function RoutePlanner() {
  const { planes, assignRoute } = useGameStore();
  const [selectedPlane, setSelectedPlane] = useState<string>('');
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [ticketPrice, setTicketPrice] = useState<number>(500);

  const idlePlanes = planes.filter(p => p.status === 'idle');
  const currentPlane = idlePlanes.find(p => p.id === selectedPlane);

  const handleDispatch = () => {
    if (!selectedPlane || !selectedDestination) return;

    if (assignRoute(selectedPlane, selectedDestination, ticketPrice)) {
      alert('Flight dispatched successfully!');
      setSelectedPlane('');
      setSelectedDestination('');
    } else {
      alert('Failed to dispatch flight.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Route Planner</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
        <div className="space-y-6">

          {/* Plane Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Available Plane
            </label>
            <select
              value={selectedPlane}
              onChange={(e) => setSelectedPlane(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose a Plane --</option>
              {idlePlanes.map(p => {
                const loc = AIRPORTS.find(a => a.id === p.currentAirportId);
                return (
                  <option key={p.id} value={p.id}>
                    {p.name} (Currently at {loc?.name || p.currentAirportId})
                  </option>
                );
              })}
            </select>
            {idlePlanes.length === 0 && (
              <p className="text-sm text-red-500 mt-2">No idle planes available.</p>
            )}
          </div>

          {/* Destination Selection */}
          {currentPlane && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Destination
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose Destination --</option>
                {AIRPORTS.filter(a => a.id !== currentPlane.currentAirportId).map(a => (
                  <option key={a.id} value={a.id}>
                    {a.city}, {a.country} ({a.name})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Ticket Price */}
          {currentPlane && selectedDestination && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Price ($)
              </label>
              <input
                type="number"
                min="50"
                step="10"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                Higher prices yield more money, assuming full capacity for now.
              </p>
            </div>
          )}

          {/* Dispatch Button */}
          <button
            onClick={handleDispatch}
            disabled={!selectedPlane || !selectedDestination}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Navigation size={20} />
            Dispatch Flight
          </button>

        </div>
      </div>
    </div>
  );
}
