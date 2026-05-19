import { NextRequest } from "next/server";
import { getEvent } from "@/lib/events";
import { buildContextWindow, SYSTEM_LIVE } from "@/lib/prompts";
import { mimoText, MimoUnavailableError } from "@/lib/mimo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/commentary?eventId=ftx-collapse&cursor=1668006180000
 *
 * Streams Server-Sent Events from MiMo v2.5 Pro narrating the cursor.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const eventId = url.searchParams.get("eventId") ?? "";
  const cursor = Number(url.searchParams.get("cursor") ?? "0");
  const event = getEvent(eventId);

  if (!event || !cursor) {
    return new Response(
      JSON.stringify({ error: "missing eventId or cursor" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const context = buildContextWindow(event, cursor);
  const userMsg = `Narrate what is happening at the cursor right now. Use the corpus below.\n\n${context}`;

  try {
    const upstream = await mimoText({
      stream: true,
      temperature: 0.35,
      maxTokens: 600,
      messages: [
        { role: "system", content: SYSTEM_LIVE },
        { role: "user", content: userMsg },
      ],
    });
    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    if (e instanceof MimoUnavailableError) {
      // Mock fallback for previews without an API key.
      const mock = mockNarrative(event.shortName, cursor);
      return new Response(mock, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    }
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "upstream" }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
}

function mockNarrative(name: string, cursor: number): string {
  const ts = new Date(cursor).toISOString();
  const text = `[mock — set MIMO_API_KEY] ${name} replay at ${ts}. The corpus shows price action and onchain transfers around this cursor. Configure MiMo v2.5 Pro to get live commentary.`;
  const chunks = text.split(" ");
  let body = "";
  for (const c of chunks) {
    body += `data: ${JSON.stringify({ choices: [{ delta: { content: c + " " } }] })}\n\n`;
  }
  body += "data: [DONE]\n\n";
  return body;
}
