import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import VehicleStatus from "./components/VehicleStatus";
import MapPanel from "./components/MapPanel";
import ControlPanel from "./components/ControlPanel";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function App() {
  const [autopilot, setAutopilot] = useState(true);
  const [driving, setDriving] = useState(true);
  const [speed, setSpeed] = useState(38); // km/h
  const [battery, setBattery] = useState(78); // %
  const [gear, setGear] = useState("D");
  const [temp, setTemp] = useState(27); // C
  const [gps, setGps] = useState(4); // bars 0-5
  const [steering, setSteering] = useState(2); // -30..30 deg
  const [heading, setHeading] = useState(30); // 0..360
  const [laneOffset, setLaneOffset] = useState(0); // -1 .. 1 m
  const [position, setPosition] = useState({ x: 18, y: 82 }); // 0..100
  const [obstacles, setObstacles] = useState([
    { id: 1, x: 55, y: 40, v: 0 },
    { id: 2, x: 70, y: 65, v: 0 },
  ]);

  const speedHistoryRef = useRef(Array.from({ length: 60 }, () => 0));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setBattery((b) => clamp(b - (driving ? 0.02 : 0.005), 0, 100));
      setTemp((t) => clamp(t + (driving ? 0.01 : -0.005), 18, 45));
      setGps((g) => clamp(g + (Math.random() - 0.5 > 0.4 ? 1 : Math.random() - 0.5 < -0.4 ? -1 : 0), 2, 5));

      setSpeed((s) => {
        const target = autopilot && driving ? 48 : driving ? 30 : 0;
        const next = s + (target - s) * 0.08 + (Math.random() - 0.5) * 0.6;
        return clamp(next, 0, 120);
      });

      setSteering((st) => clamp(st + (Math.random() - 0.5) * (autopilot ? 2 : 6), -30, 30));
      setHeading((h) => (h + (steering / 60) * (speed / 40)) % 360);

      setLaneOffset((l) => clamp(l + (autopilot ? -l * 0.2 : (Math.random() - 0.5) * 0.06), -1.2, 1.2));

      setPosition((p) => {
        const rad = (heading * Math.PI) / 180;
        const dx = Math.cos(rad) * (speed / 300);
        const dy = -Math.sin(rad) * (speed / 300);
        let nx = p.x + dx;
        let ny = p.y + dy;
        if (nx < 5 || nx > 95) nx = clamp(nx, 5, 95);
        if (ny < 5 || ny > 95) ny = clamp(ny, 5, 95);
        return { x: nx, y: ny };
      });

      setObstacles((obs) =>
        obs.map((o) => ({
          ...o,
          x: clamp(o.x + (Math.random() - 0.5) * 0.3, 10, 90),
          y: clamp(o.y + (Math.random() - 0.5) * 0.3, 10, 90),
        }))
      );
    }, 250);
    return () => clearInterval(id);
  }, [autopilot, driving, heading, steering, speed]);

  useEffect(() => {
    speedHistoryRef.current.push(speed);
    if (speedHistoryRef.current.length > 120) speedHistoryRef.current.shift();
  }, [tick, speed]);

  const onToggleAutopilot = () => setAutopilot((a) => !a);
  const onStartStop = () => setDriving((d) => !d);
  const onLaneChange = (dir) => setLaneOffset((l) => clamp(l + (dir === "left" ? -0.4 : 0.4), -1.5, 1.5));

  const warnings = useMemo(() => {
    const list = [];
    if (battery < 15) list.push({ level: "critical", msg: "Low battery" });
    if (gps <= 2) list.push({ level: "warning", msg: "Weak GPS" });
    if (Math.abs(laneOffset) > 0.8) list.push({ level: "warning", msg: "Lane centering" });
    if (speed > 80) list.push({ level: "info", msg: "High speed" });
    return list;
  }, [battery, gps, laneOffset, speed]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-red-500/60 selection:text-white">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="h-56 bg-gradient-to-b from-red-500/10 via-transparent to-transparent" />
      </div>

      <Header autopilot={autopilot} driving={driving} />

      <main className="mx-auto max-w-7xl px-4 pb-10">
        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-12 lg:col-span-8">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur">
              <div className="flex items-center justify-between p-4 border-b border-neutral-800/80">
                <h2 className="font-semibold tracking-tight text-neutral-200">Perception Map</h2>
                <div className="text-xs text-neutral-400">Heading {heading.toFixed(0)}° • Latency 22ms</div>
              </div>
              <MapPanel position={position} heading={heading} obstacles={obstacles} route={[{x:10,y:90},{x:30,y:70},{x:50,y:50},{x:70,y:40},{x:90,y:35}]}/>
            </div>
          </section>

          <aside className="col-span-12 lg:col-span-4 space-y-6">
            <VehicleStatus
              speed={speed}
              battery={battery}
              gear={gear}
              temp={temp}
              gps={gps}
              steering={steering}
              laneOffset={laneOffset}
              warnings={warnings}
              history={speedHistoryRef.current}
            />

            <ControlPanel
              autopilot={autopilot}
              driving={driving}
              onToggleAutopilot={onToggleAutopilot}
              onStartStop={onStartStop}
              onLaneChange={onLaneChange}
            />
          </aside>
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-6 text-xs text-neutral-500">
        <div className="flex items-center justify-between">
          <span>Anthropic-inspired demo dashboard</span>
          <span>v0.1 • Built with React + Tailwind</span>
        </div>
      </footer>
    </div>
  );
}
