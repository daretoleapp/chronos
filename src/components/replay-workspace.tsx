"use client";

import { useMemo, useState } from "react";
import type { ChronosEvent } from "@/lib/types";
import { Scrubber } from "./scrubber";
import { Commentary } from "./commentary";
import { PatternPanel } from "./pattern-panel";
import { ChatPanel } from "./chat-panel";
import { PriceChart } from "./price-chart";

interface Props {
  event: ChronosEvent;
}

const fmtUsd = (n?: number) => {
  if (!n) return "";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
};

const fmtTime = (ms: number) =>
  new Date(ms).toISOString().replace("T", " ").slice(0, 16) + " UTC";

export function ReplayWorkspace({ event }: Props) {
  const start = Date.parse(event.startsAt);
  const [cursor, setCursor] = useState<number>(start);

  const visibleTxs = useMemo(
    () =>
      event.txs
        .filter((t) => Math.abs(t.t - cursor) < 24 * 3600 * 1000)
        .sort((a, b) => a.t - b.t),
    [event.txs, cursor],
  );

  const visibleSocial = useMemo(
    () =>
      event.social
        .filter((s) => Math.abs(s.t - cursor) < 24 * 3600 * 1000)
        .sort((a, b) => a.t - b.t),
    [event.social, cursor],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-500/70 mb-1">
            {event.category.replace(/-/g, " ")}
          </div>
          <h1 className="text-3xl font-semibold text-zinc-100">{event.name}</h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            {event.blurb}
          </p>
        </div>
        <a
          href={`/api/report?eventId=${encodeURIComponent(event.id)}`}
          target="_blank"
          rel="noopener"
          className="text-sm border border-zinc-800 hover:border-amber-500/50 px-3 py-2 rounded-lg text-zinc-300 hover:text-amber-400 transition whitespace-nowrap"
        >
          Generate report ↗
        </a>
      </div>

      <Scrubber event={event} cursor={cursor} onCursor={setCursor} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PriceChart event={event} cursor={cursor} />
          <Commentary eventId={event.id} cursor={cursor} />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
              <div className="text-xs uppercase tracking-widest text-amber-500/80 mb-3">
                Onchain (±24h)
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {visibleTxs.length === 0 && (
                  <div className="text-sm text-zinc-500">
                    No tagged onchain activity in this window.
                  </div>
                )}
                {visibleTxs.map((tx) => (
                  <div key={tx.hash} className="text-xs text-zinc-300 leading-snug">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                      <span>{fmtTime(tx.t)}</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 uppercase text-[9px]">
                        {tx.chain}
                      </span>
                      {tx.usd && <span className="text-amber-500/80">{fmtUsd(tx.usd)}</span>}
                    </div>
                    <div className="mt-1 text-zinc-300">{tx.summary}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
              <div className="text-xs uppercase tracking-widest text-amber-500/80 mb-3">
                Chatter (±24h)
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {visibleSocial.length === 0 && (
                  <div className="text-sm text-zinc-500">Quiet on socials.</div>
                )}
                {visibleSocial.map((s) => (
                  <div key={`${s.handle}-${s.t}`} className="text-xs text-zinc-300 leading-snug">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                      <span>{fmtTime(s.t)}</span>
                      <span className="text-amber-500/70">{s.handle}</span>
                    </div>
                    <div className="mt-1 text-zinc-300 italic">&ldquo;{s.text}&rdquo;</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <PatternPanel event={event} />
          <ChatPanel eventId={event.id} cursor={cursor} />
        </div>
      </div>
    </div>
  );
}
