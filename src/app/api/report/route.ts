import { NextRequest, NextResponse } from "next/server";
import { getEvent } from "@/lib/events";
import { buildContextWindow, SYSTEM_REPORT } from "@/lib/prompts";
import { completeText, MimoUnavailableError } from "@/lib/mimo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/report?eventId=ftx-collapse — auto-generated markdown post-mortem.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const eventId = url.searchParams.get("eventId") ?? "";
  const event = getEvent(eventId);
  if (!event) {
    return NextResponse.json({ error: "unknown eventId" }, { status: 400 });
  }

  // Use the event midpoint as cursor and a wide window so the corpus is exhaustive.
  const start = Date.parse(event.startsAt);
  const end = Date.parse(event.endsAt);
  const cursor = (start + end) / 2;
  const corpus = buildContextWindow(event, cursor, end - start);

  try {
    const md = await completeText(
      [
        { role: "system", content: SYSTEM_REPORT },
        { role: "user", content: corpus },
      ],
      { temperature: 0.25, maxTokens: 2200 },
    );
    return new NextResponse(md, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `inline; filename="${event.id}.md"`,
      },
    });
  } catch (e) {
    if (e instanceof MimoUnavailableError) {
      return new NextResponse(
        `# ${event.name}\n\n_[mock — set MIMO_API_KEY to generate a real report]_\n`,
        { headers: { "Content-Type": "text/markdown; charset=utf-8" } },
      );
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "upstream" },
      { status: 502 },
    );
  }
}
