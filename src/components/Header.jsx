import React from "react";
import { Car, ShieldCheck, Signal, Power } from "lucide-react";

export default function Header({ autopilot, driving }) {
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-7 grid place-items-center rounded bg-red-500 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15)]">
            <Car size={16} />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight">Anthropic Drive</div>
            <div className="text-[11px] text-neutral-400 -mt-0.5">Self-driving dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="hidden md:flex items-center gap-1.5 text-neutral-300">
            <ShieldCheck size={16} className={autopilot ? "text-green-400" : "text-neutral-500"} />
            <span className="text-xs">Autopilot</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded ${autopilot ? "bg-green-500/10 text-green-400" : "bg-neutral-700/40 text-neutral-300"}`}>{autopilot ? "ENGAGED" : "MANUAL"}</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-neutral-300">
            <Signal size={16} className={driving ? "text-red-400" : "text-neutral-500"} />
            <span className="text-xs">Drive</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded ${driving ? "bg-red-500/10 text-red-400" : "bg-neutral-700/40 text-neutral-300"}`}>{driving ? "ACTIVE" : "STANDBY"}</span>
          </div>
          <div className="hidden md:block text-xs text-neutral-400">{time}</div>
          <button className="inline-flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800 transition-colors">
            <Power size={14} className="text-red-400" />
            System
          </button>
        </div>
      </div>
    </header>
  );
}
