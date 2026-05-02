'use client';

import { useEffect, useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, Line, Marker } from 'react-simple-maps';
import { OwnedPlane, useGameStore } from '@/store/useGameStore';
import { AIRPORTS } from '@/data/airports';
import { geoInterpolate } from 'd3-geo';

const geoUrl = '/features.json';

export default function GameMap() {
  const { planes } = useGameStore();
  const [nowMs, setNowMs] = useState(0);

  useEffect(() => {
    let frame = 0;
    let lastUpdate = Date.now();

    const loop = () => {
      const now = Date.now();
      if (now - lastUpdate > 120) {
        setNowMs(now);
        lastUpdate = now;
      }
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const activeFlights = useMemo(() => planes.filter((p) => p.status === 'flying' && p.route), [planes]);

  const getPlanePosition = (plane: OwnedPlane): [number, number] | null => {
    const route = plane.route;
    if (!route) return null;

    const from = AIRPORTS.find((a) => a.id === plane.currentAirportId);
    const to = AIRPORTS.find((a) => a.id === route.destinationAirportId);
    if (!from || !to) return null;

    const timeRatio = Math.max(0, Math.min(1, (nowMs - route.departureTime) / Math.max(1, route.estimatedArrivalTime - route.departureTime)));
    const progressRatio = Math.max(Math.min(route.progress / route.distance, 1), timeRatio);

    const interpolate = geoInterpolate([from.lng, from.lat], [to.lng, to.lat]);
    return interpolate(progressRatio) as [number, number];
  };

  return (
    <div className="h-[620px] bg-gradient-to-b from-sky-200 to-sky-100 rounded-2xl overflow-hidden shadow-lg border border-sky-200 relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140 }}
        width={800}
        height={400}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) => geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth={0.4}
              style={{ default: { outline: 'none' }, hover: { fill: '#e2e8f0', outline: 'none' }, pressed: { outline: 'none' } }}
            />
          ))}
        </Geographies>

        {AIRPORTS.map((airport) => (
          <Marker key={airport.id} coordinates={[airport.lng, airport.lat]}>
            <circle r={2.4} fill="#ef4444" stroke="#fff" strokeWidth={1} />
            <text textAnchor="middle" y={-6} style={{ fontFamily: 'system-ui', fill: '#334155', fontSize: '6px', fontWeight: 700 }}>
              {airport.id}
            </text>
          </Marker>
        ))}

        {activeFlights.map((plane) => {
          const route = plane.route;
          if (!route) return null;
          const from = AIRPORTS.find((a) => a.id === plane.currentAirportId);
          const to = AIRPORTS.find((a) => a.id === route.destinationAirportId);
          if (!from || !to) return null;

          const currentPos = getPlanePosition(plane);

          return (
            <g key={plane.id}>
              <Line
                from={[from.lng, from.lat]}
                to={[to.lng, to.lat]}
                stroke="#2563eb"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeDasharray="7 5"
                style={{ opacity: 0.75 }}
              />

              {currentPos && (
                <Marker coordinates={currentPos}>
                  <circle r={5} fill="rgba(37, 99, 235, 0.2)" />
                  <circle r={3.4} fill="#1d4ed8" stroke="#dbeafe" strokeWidth={1} />
                  <text textAnchor="middle" y={-14} style={{ fontFamily: 'system-ui', fill: '#1e3a8a', fontSize: '6px', fontWeight: 700 }}>
                    {plane.name}
                  </text>
                </Marker>
              )}
            </g>
          );
        })}
      </ComposableMap>
    </div>
  );
}
