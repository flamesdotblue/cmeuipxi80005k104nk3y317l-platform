import React from "react";
import { Pause, Play, Bot, ArrowLeftRight } from "lucide-react";

export default function ControlPanel({ autopilot, driving, onToggleAutopilot, onStartStop, onLaneChange }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between">
        <h3 className="font-semibold text-neutral-200">Controls</h3>
        <span className={`text-[11px] px-1.5 py-0.5 rounded ${driving ? "bg-red-500/10 text-red-400" : "bg-neutral-700/40 text-neutral-300"}`}>{driving ? "ACTIVE" : "STANDBY"}</span>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        <button
          onClick={onStartStop}
          className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${driving ? "border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-200" : "border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-200"}`}
        >
          {driving ? <Pause size={16} /> : <Play size={16} />}
          {driving ? "Pause Drive" : "Start Drive"}
        </button>
        <button
          onClick={onToggleAutopilot}
          className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${autopilot ? "border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-200" : "border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200"}`}
        >
          <Bot size={16} />
          {autopilot ? "Autopilot On" : "Autopilot Off"}
        </button>
        <button
          onClick={() => onLaneChange("left")}
          className="col-span-1 inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:border-neutral-700 hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeftRight size={16} className="-scale-x-100" />
          Lane Left
        </button>
        <button
          onClick={() => onLaneChange("right")}
          className="col-span-1 inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm hover:border-neutral-700 hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeftRight size={16} />
          Lane Right
        </button>
        <p className="col-span-2 text-[11px] leading-relaxed text-neutral-400">
          This is a demo interface inspired by Anthropic design sensibilities. Visualizations and data are simulated for presentation purposes.
        </p>
      </div>
    </div>
  );
}
