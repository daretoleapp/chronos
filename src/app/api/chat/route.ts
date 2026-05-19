import { NextRequest, NextResponse } from "next/server";
import { getEvent } from "@/lib/events";
import { buildContextWindow, SYSTEM_CHAT } from "@/lib/prompts";
import { completeText, isMimoFallback } from "@/lib/mimo";
import { mockChatReply } from "@/lib/mock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatBody {
  eventId: string;
  cursor: number;
  question: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChatBody;
  const event = getEvent(body.eventId);
  if (!event) {
    return NextResponse.json({ error: "unknown eventId" }, { status: 400 });
  }
  const context = buildContextWindow(
    event,
    body.cursor || Date.parse(event.startsAt),
    72 * 60 * 60 * 1000,
  );
  try {
    const reply = await completeText(
      [
        { role: "system", content: SYSTEM_CHAT },
        {
          role: "user",
          content: `EVENT CORPUS:\n${context}\n\n=== USER QUESTION ===\n${body.question}`,
        },
        ...(body.history ?? []),
      ],
      { temperature: 0.3, maxTokens: 700 },
    );
    return NextResponse.json({ reply, source: "mimo" });
  } catch (e) {
    if (isMimoFallback(e)) {
      return NextResponse.json({
        reply: mockChatReply(event, body.question, body.cursor || Date.parse(event.startsAt)),
        source: "corpus",
      });
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "upstream" },
      { status: 502 },
    );
  }
}
