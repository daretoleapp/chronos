"use client";

import { useEffect, useState } from "react";
import type { ChronosEvent, PatternMatch } from "@/lib/types";
import { listEvents } from "@/lib/events";

interface Props {
  event: ChronosEvent;
}

interface MatchListResponse {
  matches: PatternMatch[];
}

interface MatchExplainResponse {
  explanation: string;
  overlap: string[];
  source: string;
}

const eventIndex = Object.fromEntries(
  listEvents().map((e) => [e.id, e]),
);

export function PatternPanel({ event }: Props) {
  const [matches, setMatches] = useState<PatternMatch[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [expl, setExpl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetch(`/api/pattern?eventId=${encodeURIComponent(event.id)}`)
      .then((r) => r.json() as Promise<MatchListResponse>)
      .then((d) => setMatches(d.matches ?? []));
  }, [event.id]);

  useEffect(() => {
    if (!active) {
      setExpl("");
      return;
    }
    setLoading(true);
    void fetch(
      `/api/pattern?eventId=${encodeURIComponent(event.id)}&matchId=${encodeURIComponent(active)}`,
    )
      .then((r) => r.json() as Promise<MatchExplainResponse>)
      .then((d) => setExpl(d.explanation ?? ""))
      .finally(() => setLoading(false));
  }, [active, event.id]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
      <div className="text-xs uppercase tracking-widest text-amber-500/80 mb-3">
        This Rhymes With
      </div>
      <div className="space-y-2 mb-4">
        {matches.map((m) => {
          const meta = eventIndex[m.eventId];
          if (!meta) return null;
          const isActive = active === m.eventId;
          return (
            <button
              key={m.eventId}
              type="button"
              onClick={() => setActive(isActive ? null : m.eventId)}
              className={`w-full text-left px-3 py-2 rounded-lg border transition ${
                isActive
                  ? "border-amber-500/60 bg-amber-500/5"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/40"
              }`}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-zinc-100">{meta.shortName}</span>
                <span className="text-xs text-zinc-500 font-mono">
                  {(m.score * 100).toFixed(0)}% match
                </span>
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                Shared: {m.reasons.slice(0, 4).join(" · ") || "n/a"}
              </div>
            </button>
          );
        })}
      </div>
      {active && (
        <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap pt-3 border-t border-zinc-800">
          {loading ? "Asking MiMo to compare…" : expl}
        </div>
      )}
    </div>
  );
}
