/**
 * Domain types for Chronos — onchain event replay with MiMo commentary.
 */

export type EventCategory =
  | "exchange-collapse"
  | "stablecoin-depeg"
  | "fund-blowup"
  | "exchange-hack"
  | "bridge-hack";

export interface PriceTick {
  /** Unix milliseconds (UTC). */
  t: number;
  /** Asset price in USD at this tick. */
  p: number;
  /** Optional volume hint (USD) for chart highlighting. */
  v?: number;
}

export interface OnchainTx {
  /** Unix milliseconds (UTC). */
  t: number;
  hash: string;
  chain: "ethereum" | "tron" | "solana" | "ronin" | "bnb" | "bitcoin";
  from: string;
  to: string;
  /** Human-readable summary used in narration ("Alameda receives 5M USDT"). */
  summary: string;
  /** USD-equivalent for sorting / scaling. */
  usd?: number;
  /** Block explorer URL. */
  url?: string;
}

export interface SocialPost {
  /** Unix milliseconds (UTC). */
  t: number;
  author: string;
  handle: string;
  text: string;
  url?: string;
  /** Optional screenshot in /public/charts/. */
  screenshot?: string;
}

export interface TimelineMoment {
  /** Unix milliseconds (UTC). */
  t: number;
  /** Short label shown on the scrubber tooltip. */
  label: string;
  /** Long-form anchor text the AI uses as a context boundary. */
  anchor: string;
  /** Severity 1-5 controls scrubber tick height. */
  severity: 1 | 2 | 3 | 4 | 5;
}

export interface ChronosEvent {
  id: string;
  name: string;
  shortName: string;
  category: EventCategory;
  /** Inclusive ISO timestamps that bound the replay. */
  startsAt: string;
  endsAt: string;
  /** Single-paragraph elevator pitch shown above the timeline. */
  blurb: string;
  /** Primary asset (BTC, LUNA, FTT...). */
  primaryAsset: string;
  /** Tickers to plot alongside the primary asset. */
  relatedAssets?: string[];
  /** Tags fed into the pattern matcher (`bank-run`, `liquidity-spiral`, etc). */
  tags: string[];
  /** Pre-computed timeline checkpoints for the scrubber. */
  moments: TimelineMoment[];
  /** Pre-cached price ticks (sparse — one per hour or so). */
  prices: PriceTick[];
  /** Curated onchain activity. */
  txs: OnchainTx[];
  /** Curated social media chatter. */
  social: SocialPost[];
  /** Path to a hero chart screenshot in /public/charts/. */
  heroChart?: string;
  /** Outbound research links for the report. */
  sources: { label: string; url: string }[];
}

export interface PatternMatch {
  eventId: string;
  /** 0-1 similarity score. */
  score: number;
  /** Reasons used to seed the MiMo explanation. */
  reasons: string[];
}

export type CommentaryMode = "live" | "report" | "pattern" | "chat";

export interface CommentaryRequest {
  eventId: string;
  /** Unix ms cursor on the timeline. */
  cursor: number;
  mode: CommentaryMode;
  /** Optional chat history for the chat mode. */
  history?: { role: "user" | "assistant"; content: string }[];
  /** Optional user question for chat mode. */
  question?: string;
}
