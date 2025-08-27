import React, { useMemo } from "react";

export default function MapPanel({ position, heading, obstacles = [], route = [] }) {
  const carShape = useMemo(() => {
    // Triangle pointing up at angle 0
    const size = 3.2;
    return `0,${-size} ${size},${size} ${-size},${size}`;
  }, []);

  return (
    <div className="relative">
      <div className="aspect-[16/9] w-full">
        <svg viewBox="0 0 100 100" className="h-full w-full block">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill="url(#grid)" />

          {route.length > 1 && (
            <polyline
              points={route.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="rgba(244,63,94,0.7)"
              strokeDasharray="2 3"
              strokeWidth="1.5"
            />
          )}

          {obstacles.map((o) => (
            <g key={o.id}>
              <circle cx={o.x} cy={o.y} r="1.8" fill="rgba(239,68,68,0.9)" />
              <circle cx={o.x} cy={o.y} r="4" fill="none" stroke="rgba(239,68,68,0.35)" strokeDasharray="2 3" />
            </g>
          ))}

          <g transform={`translate(${position.x} ${position.y}) rotate(${-heading})`}>
            <polygon points={carShape} fill="rgb(244,63,94)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4" />
          </g>
        </svg>
      </div>
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900/70 px-2 py-1 text-xs text-neutral-300 backdrop-blur">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Live perception
      </div>
    </div>
  );
}
