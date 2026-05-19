import type { ChronosEvent, TimelineMoment, OnchainTx, SocialPost, PriceTick } from "./types";

const fmt = (ms: number) =>
  new Date(ms).toISOString().replace("T", " ").slice(0, 16) + " UTC";

const fmtUsd = (n?: number) => {
  if (!n) return "";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
};

/**
 * Slice the event corpus around the cursor and serialize it for MiMo.
 * Includes ±48 hours of context, capped to keep prompts under ~6K tokens.
 */
export function buildContextWindow(
  event: ChronosEvent,
  cursor: number,
  windowMs = 48 * 60 * 60 * 1000,
): string {
  const min = cursor - windowMs;
  const max = cursor + windowMs;

  const within = <T extends { t: number }>(arr: T[]) =>
    arr.filter((x) => x.t >= min && x.t <= max).sort((a, b) => a.t - b.t);

  const moments = within(event.moments) as TimelineMoment[];
  const txs = within(event.txs) as OnchainTx[];
  const social = within(event.social) as SocialPost[];

  const lastPrice = [...event.prices]
    .filter((p) => p.t <= cursor)
    .sort((a, b) => b.t - a.t)[0] as PriceTick | undefined;
  const earlierPrice = [...event.prices]
    .filter((p) => p.t <= cursor - 24 * 3600 * 1000)
    .sort((a, b) => b.t - a.t)[0] as PriceTick | undefined;

  const priceLine = lastPrice
    ? `${event.primaryAsset} = $${lastPrice.p} (24h: ${
        earlierPrice
          ? ((lastPrice.p / earlierPrice.p - 1) * 100).toFixed(1) + "%"
          : "n/a"
      })`
    : "no price tick";

  const lines: string[] = [
    `EVENT: ${event.name} (${event.id})`,
    `CATEGORY: ${event.category}`,
    `BLURB: ${event.blurb}`,
    `CURSOR: ${fmt(cursor)}`,
    `PRICE: ${priceLine}`,
    "",
    "=== TIMELINE MOMENTS (±48h) ===",
    ...moments.map((m) => `${fmt(m.t)} [sev ${m.severity}] ${m.label}: ${m.anchor}`),
    "",
    "=== ONCHAIN ACTIVITY (±48h) ===",
    ...txs.map(
      (x) =>
        `${fmt(x.t)} ${x.chain} ${fmtUsd(x.usd)} ${x.from} → ${x.to}: ${x.summary}`,
    ),
    "",
    "=== SOCIAL CHATTER (±48h) ===",
    ...social.map(
      (s) => `${fmt(s.t)} ${s.handle} (${s.author}): ${s.text}`,
    ),
  ];
  return lines.join("\n");
}

export const SYSTEM_LIVE = `You are Chronos, an onchain event analyst. The user is replaying a historical crypto event minute-by-minute, scrubbing a timeline. Your job is to narrate what is happening at the cursor like a Bloomberg analyst on a live broadcast — but with the benefit of hindsight, the onchain receipts, and access to social posts from the moment.

Style:
- 2-3 short paragraphs, max ~120 words.
- Mix narrative ("at this point, withdrawals are visibly clogging") with concrete onchain facts ("note the $470M Alameda → FTX transfer 12 minutes ago").
- Reference specific moments from the timeline by their effect, not their label.
- Treat the user as someone who knows crypto basics but not this exact event in detail.
- No fluff, no hype, no "in conclusion".
- If the cursor is in a calm window between major moments, lean into the foreshadowing — what the price/chatter is hinting at without screaming yet.
- Show your reasoning briefly when it matters ("why is this material? because the same collateral is pledged at Genesis too — hence the cascade").`;

export const SYSTEM_PATTERN = `You are Chronos pattern analyst. The user wants to know why a CURRENT event resembles a PRIOR event. Read both event blurbs and tag overlaps, then explain the resemblance in plain English.

Output format:
- One sentence summary headline ("Both are reflexive collateral spirals").
- 3 specific structural parallels, each one short paragraph (~40 words).
- One paragraph on what's DIFFERENT — never claim two events are identical.
- No bullets in the paragraphs themselves; flowing prose.`;

export const SYSTEM_CHAT = `You are Chronos chat assistant. The user is asking a question about an onchain event. Answer using the supplied event corpus AS PRIMARY SOURCE. If the corpus does not contain the answer, say so explicitly and offer your best inference using crypto-market knowledge — but flag it as inference.

Style:
- Direct, factual.
- Quote timestamps and tx summaries from the corpus when relevant.
- 2-4 short paragraphs.
- If the user asks "what if" / counterfactual, engage with it — tag the answer as speculation and ground it in the actual mechanics of the event.`;

export const SYSTEM_REPORT = `You are Chronos report writer. Generate a publication-ready post-mortem of the supplied event, structured as markdown. Sections:

# {Event Name}
## TL;DR (3 bullets)
## Timeline (key moments with timestamps, chronological)
## Onchain forensics (most important transactions and what they reveal)
## What broke (root cause analysis)
## What it rhymes with (one paragraph: 1-2 historical parallels and why)
## Lessons (3-5 bullets, prescriptive)

Tone: dispassionate, dense, factual. Like a Galaxy Research note. Cite the corpus liberally — quote tweets and tx hashes.`;
