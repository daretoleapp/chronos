import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chronos — Replay onchain history with AI",
  description:
    "Scrub through historical onchain events with a Bloomberg-grade AI analyst beside you. FTX, Luna, 3AC, Ronin, Bybit — narrated in real time by Xiaomi MiMo v2.5 Pro.",
  metadataBase: new URL("https://chronos-onchain.vercel.app"),
  openGraph: {
    title: "Chronos — Replay onchain history",
    description:
      "Scrub through FTX, Luna, 3AC, Ronin, and Bybit with an AI analyst beside you.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-zinc-900">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <a href="/" className="flex items-center gap-3 group">
                <div className="h-7 w-7 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_18px_rgba(251,191,36,0.4)]" />
                <div>
                  <div className="text-sm font-semibold tracking-wide text-zinc-100 group-hover:text-amber-400 transition">
                    Chronos
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500">
                    onchain replay × MiMo v2.5
                  </div>
                </div>
              </a>
              <a
                href="https://github.com/daretoleapp/chronos"
                target="_blank"
                rel="noopener"
                className="text-xs text-zinc-500 hover:text-zinc-300 transition"
              >
                source ↗
              </a>
            </div>
          </header>
          <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
          <footer className="max-w-6xl mx-auto px-6 py-10 text-xs text-zinc-600">
            Built with Next.js, Tailwind, and Xiaomi MiMo v2.5 Pro on
            OpenRouter. Historical data is curated; AI commentary is generated
            with hindsight and may misattribute speculative claims. Not financial advice.
          </footer>
        </div>
      </body>
    </html>
  );
}
