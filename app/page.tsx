import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { LiveClock } from "@/components/LiveClock";
import { Navbar } from "@/components/Navbar";
import { formatBillions, formatDaysAgo, formatInt } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const HOME_TITLE = "WorldFactbook.io — AI-Powered World Factbook Alternative";
const PAGE_DESCRIPTION =
  "The free AI-powered replacement for the CIA World Factbook (shut down Feb 2026). 261 countries, live data from World Bank & IMF, AI country intelligence, free API. Updated weekly.";

const PAGE_KEYWORDS = [
  "world factbook alternative",
  "CIA world factbook replacement",
  "world factbook 2026",
  "AI country data",
  "free country data API",
  "world factbook AI",
  "country intelligence platform",
];

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: PAGE_KEYWORDS,
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_TITLE,
    description: PAGE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const QUICK = [
  { label: "Germany", slug: "germany", flag: "🇩🇪" },
  { label: "Brazil", slug: "brazil", flag: "🇧🇷" },
  { label: "Japan", slug: "japan", flag: "🇯🇵" },
  { label: "South Africa", slug: "south-africa", flag: "🇿🇦" },
  { label: "Bosnia", slug: "bosnia-and-herzegovina", flag: "🇧🇦" },
  { label: "Saudi Arabia", slug: "saudi-arabia", flag: "🇸🇦" },
] as const;

const SOURCE_PILLS = [
  { name: "World Bank", tone: "live" as const },
  { name: "IMF", tone: "live" as const },
  { name: "UN Data", tone: "live" as const },
  { name: "Freedom House", tone: "live" as const },
  { name: "REST Countries", tone: "live" as const },
  { name: "Our World in Data", tone: "gold" as const },
  { name: "Transparency Intl", tone: "gold" as const },
  { name: "UNDP HDI", tone: "gold" as const },
];

export default async function HomePage() {
  const [total, grid, feedPool] = await Promise.all([
    prisma.country.count(),
    prisma.country.findMany({
      where: { population: { not: null } },
      orderBy: [{ population: "desc" }],
      take: 6,
    }),
    prisma.country.findMany({
      orderBy: { updatedAt: "desc" },
      take: 24,
    }),
  ]);

  const feed = feedPool.slice(0, 8).map((c, i) => {
    const fields = [
      { key: "GDP (USD bn)", val: formatBillions(c.gdp), dir: "up" as const },
      { key: "Population", val: formatInt(c.population), dir: "neutral" as const },
      { key: "GDP / capita", val: c.gdpPerCapita != null ? `$${formatInt(c.gdpPerCapita)}` : "—", dir: "up" as const },
      { key: "Unemployment %", val: c.unemployment != null ? String(c.unemployment) : "—", dir: "down" as const },
      { key: "Public debt % GDP", val: c.publicDebt != null ? String(c.publicDebt) : "—", dir: "neutral" as const },
      { key: "Inflation %", val: c.inflation != null ? String(c.inflation) : "—", dir: "down" as const },
      { key: "Life expectancy", val: c.lifeExpectancy != null ? String(c.lifeExpectancy) : "—", dir: "up" as const },
      { key: "Literacy %", val: c.literacyRate != null ? String(c.literacyRate) : "—", dir: "up" as const },
    ];
    const pick = fields[i % fields.length];
    const color =
      pick.dir === "up" ? "text-live" : pick.dir === "down" ? "text-gold2" : "text-cream";
    return { c, pick, color };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WorldFactbook.io",
    url: "https://worldfactbook.io",
    description: "AI-powered replacement for the CIA World Factbook",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://worldfactbook.io/countries/{search_term_string}/",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-12 md:px-6 md:py-16">
          <div>
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-live">
              <span className="h-px w-8 bg-live" aria-hidden />
              Live global intelligence · {total || 260} countries · Weekly updates
            </p>
            <h1 className="mt-6 font-display font-semibold leading-[0.95]">
              <span className="block text-[clamp(2.5rem,6vw,3.6rem)] text-cream">The CIA</span>
              <span
                className="mt-1 block text-[clamp(2.5rem,6vw,3.6rem)] text-muted line-through decoration-gold decoration-2"
                style={{ WebkitTextDecorationColor: "var(--gold)" }}
              >
                stopped.
              </span>
              <span className="mt-1 block text-[clamp(2.5rem,6vw,3.6rem)] italic text-gold">We continue.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
              On <strong className="text-cream">4 February 2026</strong>, the CIA retired the public World Factbook site.
              WorldFactbook.io preserves the same structured fields you relied on for SEO and research — refreshed on our
              pipeline, with a free JSON API and exports for analysts, students, and builders.
            </p>
            <form action="/countries/united-states/" className="mt-8 flex max-w-lg gap-2">
              <input
                name="q"
                readOnly
                placeholder="Search countries (use Rankings for sortable grid)"
                className="w-full rounded border border-bg4 bg-bg3 px-4 py-3 text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none"
              />
              <Link
                href="/rankings/"
                className="shrink-0 rounded bg-gold px-4 py-3 font-mono text-xs font-bold uppercase tracking-wide text-bg"
              >
                SEARCH →
              </Link>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {QUICK.map((t) => (
                <Link
                  key={t.slug}
                  href={`/countries/${t.slug}/`}
                  className="rounded-full border border-bg4 bg-bg2 px-3 py-1.5 text-sm text-cream/90 transition-colors hover:border-gold hover:text-gold"
                >
                  {t.flag} {t.label}
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-xl border border-bg4 bg-bg2/80 p-5 shadow-[0_0_0_1px_rgba(232,168,60,0.06)]">
            <div className="flex items-center justify-between gap-2 border-b border-bg4 pb-3">
              <div className="flex items-center gap-2">
                <span className="live-dot inline-block h-2.5 w-2.5 rounded-full bg-live" />
                <span className="font-display text-lg text-cream">Live data feed</span>
              </div>
              <LiveClock />
            </div>
            <ul className="mt-4 space-y-3">
              {feed.map(({ c, pick, color }) => (
                <li
                  key={`${c.id}-${pick.key}`}
                  className="flex gap-3 rounded-lg border border-bg4/80 bg-bg3/40 px-3 py-2.5"
                >
                  <span className="text-2xl leading-none" aria-hidden>
                    {c.flag}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm text-cream">{c.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-muted">{pick.key}</p>
                    <p className={`font-mono text-sm font-bold ${color}`}>{pick.val}</p>
                    <p className="text-[10px] text-muted">CIA Factbook JSON · factbook.json</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-bg4 pt-3 font-mono text-[10px] uppercase tracking-wider text-muted">
              <p className="text-live/90">8 live sources · weekly refresh</p>
              <p className="mt-1">Public domain · free</p>
            </div>
          </aside>
        </section>

        <section className="border-y border-bg4 bg-bg2/50 py-8">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Data sources</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SOURCE_PILLS.map((s) => (
                <span
                  key={s.name}
                  className="inline-flex items-center gap-2 rounded-full border border-bg4 bg-bg3 px-3 py-1.5 text-xs text-cream/90"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${s.tone === "live" ? "bg-live" : "bg-gold"}`}
                    aria-hidden
                  />
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: String(total || 260),
                l: "Countries & territories",
                h: "All CIA entities",
                up: true,
              },
              {
                n: "1,400+",
                l: "Live data indicators",
                h: "More than CIA had",
                up: true,
              },
              {
                n: "AI",
                l: "Country intelligence",
                h: "Powered by Claude",
                up: true,
              },
              {
                n: "Free",
                l: "Always open data",
                h: "REST API included",
                up: true,
              },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-bg4 bg-bg2/60 p-5">
                <p className="font-display text-4xl text-gold md:text-5xl">{s.n}</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-wide text-muted">{s.l}</p>
                <p className="mt-3 font-mono text-[10px] text-live">
                  {s.up ? "↑ " : ""}
                  {s.h.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
          <h2 className="font-display text-2xl text-cream md:text-3xl">Largest populations</h2>
          <p className="mt-2 text-sm text-muted">Six countries from the live database — hover for gold accent.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {grid.map((c) => (
              <Link
                key={c.id}
                href={`/countries/${c.slug}/`}
                className="group rounded-xl border border-bg4 bg-bg2/70 p-5 transition-colors hover:border-gold hover:shadow-[0_0_0_1px_rgba(232,168,60,0.35)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-3xl">{c.flag}</p>
                    <h3 className="mt-2 font-display text-xl text-cream group-hover:text-gold">{c.name}</h3>
                    <p className="text-sm text-muted">{c.region}</p>
                  </div>
                  <span className="live-dot mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-live" />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs">
                  <div>
                    <dt className="text-muted">GDP</dt>
                    <dd className="text-gold2">{formatBillions(c.gdp)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Population</dt>
                    <dd className="text-cream">{formatInt(c.population)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Democracy</dt>
                    <dd className="text-cream">{c.democracyScore ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">HDI</dt>
                    <dd className="text-cream">{c.hdiScore ?? "—"}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-[10px] font-mono uppercase tracking-wide text-live">
                  Live · Updated {formatDaysAgo(c.dataUpdatedAt)}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-bg4 bg-bg2/40 py-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:px-6">
            <div className="rounded-xl border border-bg4 bg-bg p-4 font-mono text-sm text-cream/90 shadow-inner">
              <div className="border-b border-bg4 pb-2 text-xs text-gold">bosnia@worldfactbook:~$ ./intel</div>
              <pre className="mt-4 whitespace-pre-wrap text-xs leading-relaxed text-cream/85">
                {`> Summarize Bosnia and Herzegovina governance risks for 2026.
  
  • Dayton institutions still fragment executive authority
  • Entity-level veto slows EU alignment
  • Youth emigration pressures fiscal stability

> Sources?
  
  CIA Factbook JSON (Government), World Bank (WDI)`}
                <span className="terminal-cursor ml-0.5 inline-block h-4 w-2 bg-gold align-middle" />
              </pre>
            </div>
            <div>
              <h2 className="font-display text-2xl text-gold md:text-3xl">AI Intel layer</h2>
              <p className="mt-3 text-muted">
                Ask structured questions across merged Factbook fields and supplemental open data — tuned for analysts who
                still think in CIA section headings.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-cream/90">
                <li className="flex gap-2">
                  <span className="text-live">●</span> Section-aware answers (Geography, Economy, Military…)
                </li>
                <li className="flex gap-2">
                  <span className="text-live">●</span> Citations back to raw JSON nodes where possible
                </li>
                <li className="flex gap-2">
                  <span className="text-live">●</span> Compare mode for peer economies and alliances
                </li>
                <li className="flex gap-2">
                  <span className="text-live">●</span> Export to Markdown / JSON for briefings
                </li>
              </ul>
              <div className="mt-8 rounded-xl border border-gold/40 bg-bg3/60 p-4">
                <p className="font-mono text-xs uppercase tracking-wider text-gold">Mini compare</p>
                <div className="mt-3 flex items-center justify-between gap-4 font-display text-lg text-cream">
                  <span>🇩🇪 Germany</span>
                  <span className="text-muted">vs</span>
                  <span>🇫🇷 France</span>
                </div>
                <Link
                  href="/compare/?a=germany&b=france"
                  className="mt-4 inline-block font-mono text-xs font-bold uppercase tracking-wide text-gold hover:underline"
                >
                  Open compare →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
