import { NextRequest, NextResponse } from "next/server";
import { getEvent, patternMatch } from "@/lib/events";
import { SYSTEM_PATTERN } from "@/lib/prompts";
import { completeText, MimoUnavailableError } from "@/lib/mimo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/pattern?eventId=...&matchId=...
 *
 * Returns:
 *   - pre-computed similarity matches if matchId omitted
 *   - MiMo-generated explanation comparing eventId ↔ matchId if both supplied
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const eventId = url.searchParams.get("eventId") ?? "";
  const matchId = url.searchParams.get("matchId");
  const target = getEvent(eventId);
  if (!target) {
    return NextResponse.json({ error: "unknown eventId" }, { status: 400 });
  }

  if (!matchId) {
    return NextResponse.json({ matches: patternMatch(eventId, 4) });
  }

  const match = getEvent(matchId);
  if (!match) {
    return NextResponse.json({ error: "unknown matchId" }, { status: 400 });
  }

  const overlap = target.tags.filter((t) => match.tags.includes(t));
  const ctx = [
    `CURRENT EVENT: ${target.name}`,
    `Blurb: ${target.blurb}`,
    `Tags: ${target.tags.join(", ")}`,
    "",
    `PRIOR EVENT: ${match.name}`,
    `Blurb: ${match.blurb}`,
    `Tags: ${match.tags.join(", ")}`,
    "",
    `Tag overlap: ${overlap.join(", ")}`,
  ].join("\n");

  try {
    const explanation = await completeText(
      [
        { role: "system", content: SYSTEM_PATTERN },
        { role: "user", content: ctx },
      ],
      { temperature: 0.3, maxTokens: 600 },
    );
    return NextResponse.json({
      explanation,
      overlap,
      source: "mimo",
    });
  } catch (e) {
    if (e instanceof MimoUnavailableError) {
      return NextResponse.json({
        explanation: `[mock — set MIMO_API_KEY] ${target.shortName} resembles ${match.shortName} on these axes: ${overlap.join(", ")}.`,
        overlap,
        source: "mock",
      });
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "upstream" },
      { status: 502 },
    );
  }
}
