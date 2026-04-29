'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useGameStore } from '@/store/useGameStore';
import { AIRPORTS } from '@/data/airports';
import 'leaflet/dist/leaflet.css';

// Dynamic import for Leaflet map to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

export default function GameMap() {
  const { planes } = useGameStore();
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Import leaflet only on client side
    import('leaflet').then((leaflet) => {
      // Fix default icon issue with webpack/nextjs
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      setL(leaflet);
    });
  }, []);

  if (!L) {
    return <div className="h-[500px] bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">Loading Map...</div>;
  }

  // Calculate plane's current position based on route progress
  const getPlanePosition = (plane: any): [number, number] | null => {
    if (!plane.route) return null;

    const from = AIRPORTS.find(a => a.id === plane.currentAirportId);
    const to = AIRPORTS.find(a => a.id === plane.route.destinationAirportId);

    if (!from || !to) return null;

    const progressRatio = Math.min(plane.route.progress / plane.route.distance, 1);

    // Simple linear interpolation
    const currentLat = from.lat + (to.lat - from.lat) * progressRatio;
    const currentLng = from.lng + (to.lng - from.lng) * progressRatio;

    return [currentLat, currentLng];
  };

  const planeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/789/789395.png', // simple plane icon
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <div className="h-[600px] rounded-xl overflow-hidden shadow-sm border border-gray-100 z-0 relative">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Draw Airports */}
        {AIRPORTS.map((airport) => (
          <Marker key={airport.id} position={[airport.lat, airport.lng]}>
            <Popup>
              <b>{airport.name}</b><br/>
              {airport.city}, {airport.country}
            </Popup>
          </Marker>
        ))}

        {/* Draw Active Routes & Planes */}
        {planes.filter(p => p.status === 'flying' && p.route).map((plane) => {
          const from = AIRPORTS.find(a => a.id === plane.currentAirportId);
          const to = AIRPORTS.find(a => a.id === plane.route!.destinationAirportId);

          if (!from || !to) return null;

          const currentPos = getPlanePosition(plane);

          return (
            <div key={plane.id}>
              {/* Route Line */}
              <Polyline
                positions={[[from.lat, from.lng], [to.lat, to.lng]]}
                pathOptions={{ color: '#3b82f6', weight: 2, dashArray: '5, 10' }}
              />

              {/* Current Plane Position */}
              {currentPos && (
                <Marker position={currentPos} icon={planeIcon}>
                  <Popup>
                    <b>{plane.name}</b><br/>
                    {from.city} &rarr; {to.city}<br/>
                    Progress: {Math.round((plane.route!.progress / plane.route!.distance) * 100)}%
                  </Popup>
                </Marker>
              )}
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
