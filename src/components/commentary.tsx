"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  eventId: string;
  cursor: number;
}

export function Commentary({ eventId, cursor }: Props) {
  const [text, setText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setText("");
      setStreaming(true);
      void streamCommentary({ eventId, cursor, signal: ctrl.signal, onChunk: (c) => setText((t) => t + c) })
        .catch(() => {})
        .finally(() => setStreaming(false));
    }, 600);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [eventId, cursor]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 min-h-[220px]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-widest text-amber-500/80">
          Live Commentary · MiMo v2.5 Pro
        </div>
        {streaming && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            streaming
          </div>
        )}
      </div>
      <div className="text-zinc-200 leading-relaxed whitespace-pre-wrap">
        {text || (streaming ? "" : "Move the cursor to start narration.")}
        {streaming && <span className="inline-block w-2 h-4 -mb-0.5 ml-0.5 bg-amber-400 animate-pulse" />}
      </div>
    </div>
  );
}

interface StreamArgs {
  eventId: string;
  cursor: number;
  signal: AbortSignal;
  onChunk: (c: string) => void;
}

async function streamCommentary(args: StreamArgs) {
  const url = `/api/commentary?eventId=${encodeURIComponent(args.eventId)}&cursor=${args.cursor}`;
  const res = await fetch(url, { signal: args.signal });
  if (!res.body) return;
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const obj = JSON.parse(payload) as {
          choices?: { delta?: { content?: string } }[];
        };
        const delta = obj.choices?.[0]?.delta?.content;
        if (delta) args.onChunk(delta);
      } catch {
        // ignore malformed SSE chunk
      }
    }
  }
}
