import type { ChronosEvent, PatternMatch } from "./types";
import { ftxCollapse } from "./events/ftx";
import { lunaUst } from "./events/luna";
import { threeAcBlowup } from "./events/3ac";
import { roninBridge } from "./events/ronin";
import { bybitHack } from "./events/bybit";

export const EVENTS: ChronosEvent[] = [
  ftxCollapse,
  lunaUst,
  threeAcBlowup,
  roninBridge,
  bybitHack,
];

export function getEvent(id: string): ChronosEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}

export function listEvents(): {
  id: string;
  name: string;
  shortName: string;
  category: string;
  startsAt: string;
  blurb: string;
  primaryAsset: string;
}[] {
  return EVENTS.map((e) => ({
    id: e.id,
    name: e.name,
    shortName: e.shortName,
    category: e.category,
    startsAt: e.startsAt,
    blurb: e.blurb,
    primaryAsset: e.primaryAsset,
  }));
}

/**
 * Naive jaccard-overlap pattern matcher across event tags.
 * MiMo then explains *why* the matches are interesting.
 */
export function patternMatch(eventId: string, limit = 3): PatternMatch[] {
  const target = getEvent(eventId);
  if (!target) return [];
  const targetTags = new Set(target.tags);
  return EVENTS.filter((e) => e.id !== eventId)
    .map((e) => {
      const tags = new Set(e.tags);
      const targetArr = Array.from(targetTags);
      const intersect = targetArr.filter((t) => tags.has(t)).length;
      const union = new Set([...targetArr, ...Array.from(tags)]).size;
      const score = union === 0 ? 0 : intersect / union;
      const reasons = targetArr.filter((t) => tags.has(t));
      return { eventId: e.id, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
