'use client';

import { useState } from 'react';
import { GameToast } from './ui-toast';
import { useGameStore } from '@/store/useGameStore';
import { AIRPORTS } from '@/data/airports';
import { PLANE_MODELS } from '@/data/planes';
import { Navigation, Timer, Wand2, Send } from 'lucide-react';

const distanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export default function RoutePlanner() {
  const { planes, assignRoute } = useGameStore();
  const [selectedPlane, setSelectedPlane] = useState<string>('');
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [ticketPrice, setTicketPrice] = useState<number>(500);
  const [hubFilter, setHubFilter] = useState<string>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const idlePlanes = planes.filter(p => p.status === 'idle');
  const displayedPlanes = hubFilter === 'all' ? idlePlanes : idlePlanes.filter((p) => p.currentAirportId === hubFilter);
  const currentPlane = idlePlanes.find(p => p.id === selectedPlane);
  const planeModel = PLANE_MODELS.find((m) => m.id === currentPlane?.modelId);

  const bestDestination = (() => {
    if (!currentPlane || !planeModel) return null;
    const from = AIRPORTS.find((a) => a.id === currentPlane.currentAirportId);
    if (!from) return null;

    const candidates = AIRPORTS.filter((a) => a.id !== from.id).map((airport) => {
      const dist = distanceKm(from.lat, from.lng, airport.lat, airport.lng);
      const durationH = dist / planeModel.baseSpeed;
      const score = (planeModel.baseCapacity * ticketPrice) / Math.max(durationH, 0.1);
      return { airport, score, dist, durationH };
    });

    candidates.sort((a, b) => b.score - a.score);
    return candidates[0] || null;
  })();

  const handleDispatch = () => {
    if (!selectedPlane || !selectedDestination) return;
    if (assignRoute(selectedPlane, selectedDestination, ticketPrice)) {
      setToast({ message: 'Flight dispatched successfully!', type: 'success' });
      setSelectedPlane('');
      setSelectedDestination('');
    } else {
      setToast({ message: 'Failed to dispatch flight.', type: 'error' });
    }
  };

  const bulkDispatchFromHub = () => {
    if (hubFilter === 'all') return;
    const fromHubPlanes = idlePlanes.filter((p) => p.currentAirportId === hubFilter);
    let sent = 0;

    fromHubPlanes.forEach((plane) => {
      const destination = AIRPORTS.find((a) => a.id !== hubFilter);
      if (destination && assignRoute(plane.id, destination.id, ticketPrice)) sent += 1;
    });

    setToast({ message: `Bulk dispatch complete. ${sent} aircraft dispatched from ${hubFilter}.`, type: 'info' });
  };

  return (
    <>
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Route Control Center v2.2</h1>
        <div className="flex gap-2">
          <select value={hubFilter} onChange={(e) => setHubFilter(e.target.value)} className="border rounded-lg px-3 py-2">
            <option value="all">All hubs</option>
            {Array.from(new Set(idlePlanes.map((p) => p.currentAirportId))).map((hub) => (
              <option key={hub} value={hub}>{hub}</option>
            ))}
          </select>
          <button onClick={bulkDispatchFromHub} disabled={hubFilter === 'all'} className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:bg-gray-300">
            <Send size={16} className="inline mr-2" />Bulk Dispatch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Manual Dispatch</h2>

          <div className="space-y-5">
            <select value={selectedPlane} onChange={(e) => setSelectedPlane(e.target.value)} className="w-full p-3 border rounded-lg">
              <option value="">-- Choose a Plane --</option>
              {displayedPlanes.map(p => {
                const loc = AIRPORTS.find(a => a.id === p.currentAirportId);
                return <option key={p.id} value={p.id}>{p.name} · {loc?.id}</option>;
              })}
            </select>

            {currentPlane && (
              <select value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)} className="w-full p-3 border rounded-lg">
                <option value="">-- Choose Destination --</option>
                {AIRPORTS.filter(a => a.id !== currentPlane.currentAirportId).map(a => (
                  <option key={a.id} value={a.id}>{a.id} - {a.city}</option>
                ))}
              </select>
            )}

            <div>
              <label className="text-sm text-gray-600">Ticket Price</label>
              <input type="number" min="50" step="10" value={ticketPrice} onChange={(e) => setTicketPrice(Number(e.target.value))} className="w-full mt-1 p-3 border rounded-lg" />
            </div>

            <button onClick={handleDispatch} disabled={!selectedPlane || !selectedDestination} className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-300">
              <Navigation size={18} className="inline mr-2" />Dispatch Flight
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-xl font-bold">Smart Route Assistant</h2>
          {bestDestination ? (
            <>
              <p className="text-sm text-gray-500">Best candidate by revenue/hour:</p>
              <p className="font-semibold text-lg">{bestDestination.airport.id} · {bestDestination.airport.city}</p>
              <p className="text-sm">~{bestDestination.dist.toFixed(0)} km · {bestDestination.durationH.toFixed(1)} game hours</p>
              <button
                onClick={() => setSelectedDestination(bestDestination.airport.id)}
                disabled={!currentPlane}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg disabled:bg-gray-300"
              >
                <Wand2 size={16} className="inline mr-2" />Apply Recommendation
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-500">Select a plane to get smart recommendation.</p>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
            <p className="font-semibold flex items-center gap-2"><Timer size={16} /> Time Rule</p>
            <p>1 detik nyata = 1 jam game. Gunakan bulk dispatch buat scale cepat.</p>
          </div>
        </div>
      </div>
    </div>
      {toast && <GameToast message={toast.message} type={toast.type} />}
    </>
  );
}
