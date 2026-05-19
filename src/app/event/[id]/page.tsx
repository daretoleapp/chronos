import { notFound } from "next/navigation";
import { EVENTS, getEvent } from "@/lib/events";
import { ReplayWorkspace } from "@/components/replay-workspace";

export const dynamic = "force-static";

export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) notFound();
  return <ReplayWorkspace event={event} />;
}
