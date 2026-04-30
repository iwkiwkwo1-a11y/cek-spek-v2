'use client';

import { useMemo, useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Line, Marker } from 'react-simple-maps';
import { useGameStore } from '@/store/useGameStore';
import { AIRPORTS } from '@/data/airports';
import { geoInterpolate } from 'd3-geo';

const geoUrl = "/features.json";

export default function GameMap() {
  const { planes } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate plane's current position using D3's geoInterpolate for accurate great-circle path
  const getPlanePosition = (plane: any): [number, number] | null => {
    if (!plane.route) return null;

    const from = AIRPORTS.find(a => a.id === plane.currentAirportId);
    const to = AIRPORTS.find(a => a.id === plane.route.destinationAirportId);

    if (!from || !to) return null;

    const progressRatio = Math.min(plane.route.progress / plane.route.distance, 1);

    // d3 geoInterpolate uses [longitude, latitude]
    const interpolate = geoInterpolate([from.lng, from.lat], [to.lng, to.lat]);
    const currentPos = interpolate(progressRatio);

    return currentPos as [number, number];
  };

  const activeFlights = useMemo(() => {
    return planes.filter(p => p.status === 'flying' && p.route);
  }, [planes]);

  if (!mounted) {
    return <div className="h-[600px] bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">Loading Map...</div>;
  }

  return (
    <div className="h-[600px] bg-[#c1e0f5] rounded-xl overflow-hidden shadow-sm border border-gray-100 z-0 relative flex items-center justify-center">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 140,
        }}
        width={800}
        height={400}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#f1f5f9"
                stroke="#cbd5e1"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#e2e8f0", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {/* Draw Airports */}
        {AIRPORTS.map((airport) => (
          <Marker key={airport.id} coordinates={[airport.lng, airport.lat]}>
            <circle r={2} fill="#ef4444" stroke="#fff" strokeWidth={1} />
            <text
              textAnchor="middle"
              y={-5}
              style={{ fontFamily: "system-ui", fill: "#334155", fontSize: "6px", fontWeight: "bold" }}
            >
              {airport.id}
            </text>
          </Marker>
        ))}

        {/* Draw Routes & Planes */}
        {activeFlights.map((plane) => {
          const from = AIRPORTS.find(a => a.id === plane.currentAirportId);
          const to = AIRPORTS.find(a => a.id === plane.route!.destinationAirportId);

          if (!from || !to) return null;

          const currentPos = getPlanePosition(plane);

          return (
            <g key={plane.id}>
              {/* Route Line */}
              <Line
                from={[from.lng, from.lat]}
                to={[to.lng, to.lat]}
                stroke="#3b82f6"
                strokeWidth={1}
                strokeLinecap="round"
                strokeDasharray="4 4"
                style={{ opacity: 0.6 }}
              />

              {/* Plane Marker */}
              {currentPos && (
                <Marker coordinates={currentPos}>
                  {/* Plane Icon (SVG) */}
                  <g transform="translate(-8, -8) scale(0.6)">
                    <path
                      d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                      fill="#1e3a8a"
                    />
                  </g>
                  {/* Plane Name Tag */}
                  <text
                    textAnchor="middle"
                    y={-12}
                    style={{ fontFamily: "system-ui", fill: "#1e3a8a", fontSize: "5px", fontWeight: "bold" }}
                  >
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
