"use client";

import { useMemo } from "react";
import type { ChronosEvent, PriceTick } from "@/lib/types";

interface Props {
  event: ChronosEvent;
  cursor: number;
}

/**
 * Lightweight inline SVG price chart with cursor overlay.
 * Pure-data — no external chart lib needed for the demo.
 */
export function PriceChart({ event, cursor }: Props) {
  const { points, minP, maxP, start, end } = useMemo(() => {
    const start = Date.parse(event.startsAt);
    const end = Date.parse(event.endsAt);
    const ps = event.prices as PriceTick[];
    let minP = Infinity;
    let maxP = -Infinity;
    for (const p of ps) {
      if (p.p < minP) minP = p.p;
      if (p.p > maxP) maxP = p.p;
    }
    if (minP === maxP) {
      maxP = minP * 1.1 + 0.001;
      minP = minP * 0.9;
    }
    return { points: ps, minP, maxP, start, end };
  }, [event]);

  const W = 720;
  const H = 220;
  const padX = 24;
  const padY = 18;
  const xFor = (t: number) => padX + ((t - start) / (end - start)) * (W - 2 * padX);
  const yFor = (p: number) =>
    H - padY - ((p - minP) / (maxP - minP)) * (H - 2 * padY);

  const path = points
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${xFor(pt.t).toFixed(1)} ${yFor(pt.p).toFixed(1)}`)
    .join(" ");
  const area = path + ` L ${xFor(points[points.length - 1].t).toFixed(1)} ${H - padY} L ${xFor(points[0].t).toFixed(1)} ${H - padY} Z`;

  const cursorPrice = nearestPrice(points, cursor);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-widest text-amber-500/80">
          {event.primaryAsset} / USD
        </div>
        <div className="text-sm font-mono text-zinc-300">
          {cursorPrice !== null ? formatPrice(cursorPrice) : "—"}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <defs>
          <linearGradient id="chronosArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(245 158 11)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="rgb(245 158 11)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#chronosArea)" />
        <path d={path} stroke="rgb(251 191 36)" strokeWidth="1.6" fill="none" />
        {/* moments markers on chart */}
        {event.moments.map((m) => (
          <circle
            key={m.t}
            cx={xFor(m.t)}
            cy={yFor(nearestPrice(points, m.t) ?? minP)}
            r={2 + m.severity * 0.4}
            fill="rgb(251 191 36)"
            opacity={0.9}
          />
        ))}
        {/* cursor */}
        <line
          x1={xFor(cursor)}
          x2={xFor(cursor)}
          y1={padY}
          y2={H - padY}
          stroke="rgb(251 191 36)"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}

function nearestPrice(points: PriceTick[], t: number): number | null {
  if (!points.length) return null;
  let best = points[0];
  let bestDt = Math.abs(points[0].t - t);
  for (const p of points) {
    const dt = Math.abs(p.t - t);
    if (dt < bestDt) {
      best = p;
      bestDt = dt;
    }
  }
  return best.p;
}

function formatPrice(p: number): string {
  if (p >= 1000) return `$${p.toFixed(0)}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  if (p >= 0.001) return `$${p.toFixed(4)}`;
  return `$${p.toExponential(2)}`;
}
