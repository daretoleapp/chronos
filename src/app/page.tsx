import Link from "next/link";
import { listEvents } from "@/lib/events";

export const dynamic = "force-static";

export default function HomePage() {
  const events = listEvents();
  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-500/80 mb-2">
            time-aware onchain replay
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-50 leading-tight">
            Watch FTX collapse with an AI analyst beside you.
          </h1>
          <p className="text-zinc-400 mt-4 max-w-2xl leading-relaxed">
            Chronos lets you scrub through historical onchain events
            minute-by-minute. Xiaomi MiMo v2.5 Pro narrates the cursor in real
            time, surfaces structural parallels with prior collapses, and
            answers whatever you ask about the moment.
          </p>
          <div className="flex items-center gap-3 mt-6 text-xs text-zinc-500">
            <span className="px-2 py-1 rounded border border-zinc-800 bg-zinc-950">
              MiMo v2.5 Pro
            </span>
            <span className="px-2 py-1 rounded border border-zinc-800 bg-zinc-950">
              MiMo v2.5 multimodal
            </span>
            <span className="px-2 py-1 rounded border border-zinc-800 bg-zinc-950">
              5 events curated
            </span>
            <span className="px-2 py-1 rounded border border-zinc-800 bg-zinc-950">
              streaming SSE
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-xs uppercase tracking-widest text-zinc-500">
          replayable events
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((e) => (
            <Link
              key={e.id}
              href={`/event/${e.id}`}
              className="group rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 hover:border-amber-500/40 hover:bg-zinc-950/80 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase tracking-widest text-amber-500/70">
                  {e.category.replace(/-/g, " ")}
                </div>
                <div className="text-[10px] font-mono text-zinc-500">
                  {e.startsAt.slice(0, 10)}
                </div>
              </div>
              <div className="text-lg font-semibold text-zinc-100 group-hover:text-amber-400 transition">
                {e.name}
              </div>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed line-clamp-3">
                {e.blurb}
              </p>
              <div className="text-xs text-zinc-500 mt-3 font-mono">
                primary: {e.primaryAsset}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
        <div className="text-xs uppercase tracking-widest text-amber-500/80 mb-3">
          why MiMo v2.5
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
          The interesting part of any market event isn&rsquo;t the price chart
          &mdash; it&rsquo;s the reasoning chain. Why did Alameda need that
          $470M FTT redemption to look defensible? Why did the Anchor
          withdrawals matter before UST broke? Chronos uses MiMo v2.5 Pro&rsquo;s
          long-context reasoning to walk through the cause-and-effect at the
          cursor, and MiMo v2.5 multimodal to read price-action screenshots
          alongside the onchain receipts. The reasoning trace is the product.
        </p>
      </section>
    </div>
  );
}
