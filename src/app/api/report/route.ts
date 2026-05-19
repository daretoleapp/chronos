import { NextRequest, NextResponse } from "next/server";
import { getEvent } from "@/lib/events";
import { buildContextWindow, SYSTEM_REPORT } from "@/lib/prompts";
import { completeText, isMimoFallback } from "@/lib/mimo";
import { mockReport } from "@/lib/mock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const eventId = url.searchParams.get("eventId") ?? "";
  const event = getEvent(eventId);
  if (!event) {
    return NextResponse.json({ error: "unknown eventId" }, { status: 400 });
  }

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
        "x-chronos-source": "mimo",
      },
    });
  } catch (e) {
    if (isMimoFallback(e)) {
      return new NextResponse(mockReport(event), {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `inline; filename="${event.id}.md"`,
          "x-chronos-source": "corpus",
        },
      });
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "upstream" },
      { status: 502 },
    );
  }
}
