/**
 * Deterministic corpus-based fallbacks. Used when MIMO_API_KEY is unset OR
 * when the upstream returns an error (rate limit, insufficient credits, 5xx).
 *
 * The point: even without an API key, the demo surfaces real corpus content
 * (moments, transactions, social posts) at the cursor — not lorem ipsum.
 * Each output is clearly tagged `(corpus mode)` so reviewers know what's
 * model-generated vs. template.
 */

import type { ChronosEvent } from "./types";
import { listEvents, getEvent } from "./events";

const fmtUtc = (ms: number) =>
  new Date(ms).toISOString().replace("T", " ").slice(0, 16) + " UTC";

const fmtUsd = (n?: number) => {
  if (!n) return "";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
};

/**
 * SSE-formatted commentary fallback. Picks the moment, transaction, and
 * social post closest to the cursor and stitches them into a readable
 * narration — looks like commentary, but is template-driven.
 */
export function mockCommentarySSE(event: ChronosEvent, cursor: number): string {
  const moments = [...event.moments].sort(
    (a, b) => Math.abs(a.t - cursor) - Math.abs(b.t - cursor),
  );
  const nearestMoment = moments[0];
  const txs = [...event.txs]
    .filter((t) => Math.abs(t.t - cursor) < 36 * 3600 * 1000)
    .sort((a, b) => Math.abs(a.t - cursor) - Math.abs(b.t - cursor));
  const social = [...event.social]
    .filter((s) => Math.abs(s.t - cursor) < 36 * 3600 * 1000)
    .sort((a, b) => Math.abs(a.t - cursor) - Math.abs(b.t - cursor));

  const lines: string[] = [];
  lines.push(
    `(corpus mode — set MIMO_API_KEY with credits for live MiMo v2.5 Pro narration)`,
  );
  lines.push("");
  if (nearestMoment) {
    const dt = (nearestMoment.t - cursor) / (1000 * 3600);
    const when =
      Math.abs(dt) < 0.5
        ? "Right now"
        : dt > 0
        ? `In ${Math.round(dt)}h from cursor`
        : `${Math.round(-dt)}h ago at cursor`;
    lines.push(
      `${when}: ${nearestMoment.label}. ${nearestMoment.anchor}`,
    );
  }
  if (txs.length > 0) {
    lines.push("");
    lines.push(`Onchain (closest tx): ${fmtUtc(txs[0].t)} on ${txs[0].chain}${
      txs[0].usd ? " (" + fmtUsd(txs[0].usd) + ")" : ""
    } — ${txs[0].summary}`);
  }
  if (social.length > 0) {
    lines.push("");
    lines.push(
      `Social (closest post): ${social[0].handle} at ${fmtUtc(social[0].t)} — "${social[0].text.slice(0, 200)}"`,
    );
  }
  lines.push("");
  lines.push(
    `MiMo v2.5 Pro would weave these into a Bloomberg-grade narrative with structural analysis. The integration is plumbed at /api/commentary; add OpenRouter credits to enable live mode.`,
  );

  return ssePackage(lines.join(" "));
}

function ssePackage(text: string): string {
  // Chunk into ~60-char pieces so the UI animates the stream like a real one.
  const chunks: string[] = [];
  let buf = "";
  for (const word of text.split(/(\s+)/)) {
    buf += word;
    if (buf.length >= 60) {
      chunks.push(buf);
      buf = "";
    }
  }
  if (buf) chunks.push(buf);

  let body = "";
  for (const c of chunks) {
    body += `data: ${JSON.stringify({ choices: [{ delta: { content: c } }] })}\n\n`;
  }
  body += "data: [DONE]\n\n";
  return body;
}

export function mockPatternExplanation(
  target: ChronosEvent,
  match: ChronosEvent,
  overlap: string[],
): string {
  const overlapList =
    overlap.length > 0 ? overlap.join(", ") : "no direct tag overlap";
  return [
    `(corpus mode) Both events share the structural axes: ${overlapList}.`,
    "",
    `${target.shortName} and ${match.shortName} both involve ${overlap[0] ?? "systemic stress"} as a primary failure mode. The mechanism rhymes — collateral assumptions break, withdrawals accelerate, and the unwind reflexively destroys what was held as backing.`,
    "",
    `Where they differ: ${target.shortName} is a ${target.category.replace(/-/g, " ")}; ${match.shortName} is a ${match.category.replace(/-/g, " ")}. The proximate trigger and venue diverge even when the dynamics rhyme.`,
    "",
    `MiMo v2.5 Pro produces a richer comparison with hindsight reasoning when MIMO_API_KEY is configured.`,
  ].join("\n");
}

export function mockChatReply(
  event: ChronosEvent,
  question: string,
  cursor: number,
): string {
  const q = question.toLowerCase();
  const matches: { type: string; t: number; text: string }[] = [];

  for (const m of event.moments) {
    if (
      m.label.toLowerCase().includes(q.slice(0, 30)) ||
      m.anchor.toLowerCase().includes(q.slice(0, 30)) ||
      tokenOverlap(q, m.anchor)
    ) {
      matches.push({ type: "moment", t: m.t, text: `${m.label}: ${m.anchor}` });
    }
  }
  for (const tx of event.txs) {
    if (tokenOverlap(q, tx.summary)) {
      matches.push({
        type: "tx",
        t: tx.t,
        text: `${tx.chain} ${fmtUsd(tx.usd)}: ${tx.summary}`,
      });
    }
  }
  for (const s of event.social) {
    if (tokenOverlap(q, s.text)) {
      matches.push({
        type: "social",
        t: s.t,
        text: `${s.handle}: "${s.text}"`,
      });
    }
  }

  matches.sort(
    (a, b) => Math.abs(a.t - cursor) - Math.abs(b.t - cursor),
  );
  const top = matches.slice(0, 3);

  if (top.length === 0) {
    return `(corpus mode) The corpus around your cursor in ${event.shortName} doesn't contain a direct match for "${question}". Set MIMO_API_KEY for hindsight inference from MiMo v2.5 Pro.`;
  }

  return [
    `(corpus mode — set MIMO_API_KEY with credits for live MiMo v2.5 Pro)`,
    "",
    ...top.map((m) => `${fmtUtc(m.t)} [${m.type}] ${m.text}`),
    "",
    `These corpus excerpts are the strongest matches near your cursor. Live MiMo would synthesize them into a direct answer.`,
  ].join("\n");
}

export function mockReport(event: ChronosEvent): string {
  const lines: string[] = [];
  lines.push(`# ${event.name}`);
  lines.push("");
  lines.push(
    `> _(corpus mode — auto-generated from event timeline. Configure MIMO_API_KEY to get a MiMo v2.5 Pro post-mortem with reasoning.)_`,
  );
  lines.push("");
  lines.push("## TL;DR");
  lines.push(`- ${event.blurb}`);
  lines.push(
    `- Window: ${fmtUtc(Date.parse(event.startsAt))} → ${fmtUtc(Date.parse(event.endsAt))}`,
  );
  lines.push(
    `- Primary asset: ${event.primaryAsset}${event.relatedAssets ? " (related: " + event.relatedAssets.join(", ") + ")" : ""}`,
  );
  lines.push("");
  lines.push("## Timeline");
  for (const m of [...event.moments].sort((a, b) => a.t - b.t)) {
    lines.push(`- **${fmtUtc(m.t)}** — _${m.label}_: ${m.anchor}`);
  }
  lines.push("");
  lines.push("## Onchain forensics");
  for (const tx of [...event.txs].sort((a, b) => a.t - b.t)) {
    lines.push(
      `- **${fmtUtc(tx.t)}** \`${tx.chain}\` ${fmtUsd(tx.usd)} — ${tx.summary}`,
    );
  }
  lines.push("");
  lines.push("## Social chatter");
  for (const s of [...event.social].sort((a, b) => a.t - b.t)) {
    lines.push(
      `- **${fmtUtc(s.t)}** ${s.handle} — "${s.text}"`,
    );
  }
  lines.push("");
  lines.push("## What it rhymes with");
  const others = listEvents().filter((e) => e.id !== event.id);
  const sharedOverlap = others.map((o) => {
    const target = getEvent(o.id);
    const overlap = target ? event.tags.filter((t) => target.tags.includes(t)) : [];
    return { ...o, overlap };
  });
  sharedOverlap.sort((a, b) => b.overlap.length - a.overlap.length);
  const top = sharedOverlap.slice(0, 2);
  for (const o of top) {
    lines.push(`- **${o.shortName}** — shared dynamics: ${o.overlap.join(", ") || "n/a"}`);
  }
  lines.push("");
  lines.push("## Sources");
  for (const src of event.sources) {
    lines.push(`- [${src.label}](${src.url})`);
  }
  return lines.join("\n");
}

function tokenOverlap(q: string, text: string): boolean {
  const qTokens = new Set(
    q
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3),
  );
  if (qTokens.size === 0) return false;
  const tTokens = text.toLowerCase().split(/\W+/);
  for (const tok of tTokens) {
    if (qTokens.has(tok)) return true;
  }
  return false;
}
