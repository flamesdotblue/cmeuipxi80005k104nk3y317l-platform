import React, { useMemo } from "react";
import { Gauge, Battery, ThermometerSun, Satellite, SteeringWheel, AlertTriangle } from "lucide-react";

function Progress({ value, color = "bg-red-500" }) {
  return (
    <div className="h-2 w-full rounded-full bg-neutral-800">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function Sparkline({ data, color = "#f43f5e" }) {
  const points = useMemo(() => {
    const arr = data.slice(-60);
    const max = Math.max(60, ...arr);
    const min = 0;
    return arr.map((v, i) => {
      const x = (i / (arr.length - 1 || 1)) * 100;
      const y = 100 - ((v - min) / (max - min || 1)) * 100;
      return `${x},${y}`;
    });
  }, [data]);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-12 w-full">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points.join(" ")} />
    </svg>
  );
}

export default function VehicleStatus({ speed, battery, gear, temp, gps, steering, laneOffset, warnings, history }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between">
        <h3 className="font-semibold text-neutral-200">Vehicle Status</h3>
        <div className="text-xs text-neutral-400">Gear {gear}</div>
      </div>
      <div className="p-4 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-neutral-300"><Gauge size={16} className="text-red-400"/>Speed</div>
              <div className="text-xl font-semibold text-neutral-100">{speed.toFixed(0)}<span className="text-xs text-neutral-400 ml-1">km/h</span></div>
            </div>
            <Sparkline data={history} />
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-neutral-300"><Battery size={16} className="text-green-400"/>Battery</div>
              <div className="text-xl font-semibold text-neutral-100">{battery.toFixed(0)}<span className="text-xs text-neutral-400 ml-1">%</span></div>
            </div>
            <Progress value={battery} color={battery > 30 ? "bg-green-500" : "bg-red-500"} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
            <div className="flex items-center gap-2 text-neutral-300 mb-1"><ThermometerSun size={16} className="text-amber-400"/>Temp</div>
            <div className="text-neutral-100 font-medium">{temp.toFixed(1)}°C</div>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
            <div className="flex items-center gap-2 text-neutral-300 mb-1"><Satellite size={16} className="text-blue-400"/>GPS</div>
            <div className="flex gap-0.5" aria-label={`GPS signal ${gps} of 5`}>
              {Array.from({length:5}).map((_,i)=> (
                <div key={i} className={`h-3 w-2 rounded-sm ${i<gps?"bg-blue-400":"bg-neutral-700"}`} />
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
            <div className="flex items-center gap-2 text-neutral-300 mb-1"><SteeringWheel size={16} className="text-purple-400"/>Steering</div>
            <div className="text-neutral-100 font-medium">{steering.toFixed(0)}°</div>
            <div className="mt-2">
              <Progress value={((steering + 30) / 60) * 100} color="bg-purple-500" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-neutral-300 text-sm">Lane position</div>
            <div className="text-neutral-400 text-xs">{laneOffset.toFixed(2)} m</div>
          </div>
          <div className="h-10 relative rounded-md bg-neutral-800 overflow-hidden">
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-neutral-700" />
            <div
              className="absolute top-1/2 -translate-y-1/2 size-4 rounded-full bg-red-500 shadow-[0_0_0_4px_rgba(244,63,94,0.15)] transition-transform"
              style={{ transform: `translate(calc(${laneOffset * 40}% - 50%), -50%)` }}
            />
          </div>
        </div>

        {warnings.length > 0 && (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
            <div className="flex items-center gap-2 text-neutral-300 mb-2 text-sm"><AlertTriangle size={16} className="text-amber-400"/>System notices</div>
            <ul className="space-y-1">
              {warnings.map((w, i) => (
                <li key={i} className={`text-xs px-2 py-1 rounded border ${w.level === "critical" ? "border-red-500/30 bg-red-500/10 text-red-300" : w.level === "warning" ? "border-amber-500/30 bg-amber-500/10 text-amber-200" : "border-sky-500/30 bg-sky-500/10 text-sky-200"}`}>{w.msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
