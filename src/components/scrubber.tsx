"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChronosEvent, TimelineMoment } from "@/lib/types";

interface Props {
  event: ChronosEvent;
  cursor: number;
  onCursor: (t: number) => void;
}

const fmtUtc = (ms: number) =>
  new Date(ms).toISOString().replace("T", " ").slice(0, 16) + " UTC";

export function Scrubber({ event, cursor, onCursor }: Props) {
  const start = Date.parse(event.startsAt);
  const end = Date.parse(event.endsAt);
  const range = end - start;

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(60); // minutes per real second
  const lastTick = useRef<number>(Date.now());

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const loop = () => {
      const now = Date.now();
      const dt = now - lastTick.current;
      lastTick.current = now;
      const advance = (dt / 1000) * speed * 60_000;
      const next = Math.min(end, cursor + advance);
      onCursor(next);
      if (next < end) raf = requestAnimationFrame(loop);
      else setPlaying(false);
    };
    lastTick.current = Date.now();
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, cursor, end, onCursor]);

  const pct = useMemo(() => ((cursor - start) / range) * 100, [cursor, start, range]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="text-sm text-zinc-400">
          <span className="text-zinc-500">Cursor</span>{" "}
          <span className="font-mono text-zinc-100">{fmtUtc(cursor)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="px-3 py-1.5 text-sm rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 font-medium"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="text-xs bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-zinc-300"
          >
            <option value={10}>10x</option>
            <option value={60}>1h/s</option>
            <option value={360}>6h/s</option>
            <option value={1440}>1d/s</option>
          </select>
        </div>
      </div>

      <div className="relative h-16">
        {/* track */}
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-zinc-800" />
        {/* moments */}
        {event.moments.map((m: TimelineMoment) => {
          const left = ((m.t - start) / range) * 100;
          return (
            <button
              key={m.t}
              type="button"
              onClick={() => onCursor(m.t)}
              title={`${fmtUtc(m.t)} — ${m.label}`}
              className="absolute -translate-x-1/2 group"
              style={{ left: `${left}%`, top: "12%" }}
            >
              <div
                className="rounded-full bg-amber-500/80 ring-2 ring-zinc-950 hover:bg-amber-400 transition"
                style={{ width: 4 + m.severity * 2, height: 4 + m.severity * 2 }}
              />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
                {m.label}
              </div>
            </button>
          );
        })}
        {/* cursor */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
          style={{ left: `${pct}%` }}
        />
        {/* slider */}
        <input
          type="range"
          min={start}
          max={end}
          step={60_000}
          value={cursor}
          onChange={(e) => onCursor(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono">
        <span>{fmtUtc(start)}</span>
        <span>{fmtUtc(end)}</span>
      </div>
    </div>
  );
}
