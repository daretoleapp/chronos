"use client";

import { useState } from "react";

interface Props {
  eventId: string;
  cursor: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function ChatPanel({ eventId, cursor }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, cursor, question: q }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply ?? data.error ?? "(no reply)" },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "(network error)" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 flex flex-col">
      <div className="text-xs uppercase tracking-widest text-amber-500/80 mb-3">
        Time-Travel Chat
      </div>
      <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <div className="text-sm text-zinc-500">
            Ask anything about this event. Try: <em>&ldquo;What was Alameda's biggest miscalculation?&rdquo;</em>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm leading-relaxed ${
              m.role === "user"
                ? "text-zinc-300"
                : "text-zinc-100 bg-zinc-900/60 rounded-lg p-3 border border-zinc-800"
            }`}
          >
            {m.role === "user" && (
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                You
              </div>
            )}
            {m.role === "assistant" && (
              <div className="text-[10px] uppercase tracking-widest text-amber-500/70 mb-1">
                MiMo
              </div>
            )}
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="text-xs text-zinc-500 animate-pulse">MiMo is thinking…</div>
        )}
      </div>
      <div className="flex gap-2 mt-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          placeholder="Ask about this event…"
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60"
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-lg bg-amber-500 text-zinc-950 text-sm font-medium hover:bg-amber-400 disabled:opacity-50"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
