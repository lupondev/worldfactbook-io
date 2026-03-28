import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SITE_URL } from "@/lib/site";

const META_DESC =
  "AI-powered country briefs for 261 countries. Ask any question about any country and get answers grounded in World Bank, IMF and UN data. Free, no signup required.";

export const metadata: Metadata = {
  title: "AI Country Intelligence — WorldFactbook.io",
  description: META_DESC,
  alternates: { canonical: "/ai-country-intelligence/" },
  openGraph: {
    title: "AI Country Intelligence — WorldFactbook.io",
    description: META_DESC,
    url: `${SITE_URL}/ai-country-intelligence/`,
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Country Intelligence — WorldFactbook.io",
    description: META_DESC,
  },
};

const DEMO_GERMANY = `Germany remains the largest economy in the euro area. Nominal GDP ranks among the top globally, with a diversified export base in machinery, vehicles, and chemicals. The population is highly urbanized; labor productivity and vocational training are long-standing strengths.

Politically, Germany operates as a federal parliamentary republic. Freedom House and related indices generally place it in the highest tier for civil liberties, though policy debates continue on energy security, migration, and digital infrastructure investment.

For defense, Germany participates fully in NATO and has increased defense spending targets in recent years. Energy policy has shifted toward diversification of supply following geopolitical shocks.

WorldFactbook.io synthesizes structured Factbook-style fields with World Bank, IMF, and UN series, then uses Claude to turn that bundle into readable briefs like this one — always grounded in the numbers we store, not invented statistics.`;

export default function AiCountryIntelligencePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <header className="border-b border-[0.5px] border-[color:var(--line)] pb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">WorldFactbook.io</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-cream md:text-[2.75rem]">
            AI Country Intelligence — The Smarter World Factbook
          </h1>
          <p className="mt-5 font-sans text-base leading-relaxed text-muted">{META_DESC}</p>
        </header>

        <section className="mt-12 space-y-4">
          <h2 className="font-display text-2xl font-semibold text-cream">What is AI Country Intelligence?</h2>
          <p className="font-sans text-base leading-[1.8] text-cream/90">
            AI Country Intelligence is our layer on top of open country data. We keep canonical Factbook-style sections
            (geography, economy, government, military, society) and live indicators from the World Bank, IMF, UN, Freedom
            House, and related public datasets. Claude reads that structured profile and writes short, neutral briefs in plain
            English so you can scan a country in seconds without digging through raw JSON or PDFs.
          </p>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="font-display text-2xl font-semibold text-cream">How it works</h2>
          <ol className="list-decimal space-y-3 pl-5 font-sans text-base leading-[1.8] text-cream/90">
            <li>
              <span className="text-gold">Data sources</span> — We ingest and normalize public series (GDP, population, HDI,
              democracy scores, debt, inflation, and more) and attach them to each country row.
            </li>
            <li>
              <span className="text-gold">AI analysis</span> — Claude summarizes the stored facts into narrative paragraphs.
              It does not invent figures: outputs are tied to the same fields you see in the API and on the country page.
            </li>
            <li>
              <span className="text-gold">Plain English</span> — You get a readable overview plus access to the underlying
              metrics, rankings, and the free REST API for builders.
            </li>
          </ol>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="font-display text-2xl font-semibold text-cream">Example AI brief — Germany</h2>
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Demo copy (illustrative)</p>
          <div className="rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg2/80 p-6 font-sans text-base leading-[1.8] text-cream/90">
            {DEMO_GERMANY.split("\n\n").map((para, i) => (
              <p key={i} className={i > 0 ? "mt-4" : ""}>
                {para}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <h2 className="font-display text-2xl font-semibold text-cream">Try it for any country</h2>
          <p className="font-sans text-base leading-[1.8] text-cream/90">
            Open the countries directory, search or filter by region, then pick a profile. Where an AI summary exists, it
            appears on the overview tab.
          </p>
          <form action="/countries/" method="get" className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              name="q"
              placeholder="Search e.g. Germany, Japan, Brazil…"
              className="w-full rounded border-[0.5px] border-[color:var(--line)] bg-bg3/80 px-4 py-3 font-sans text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none"
              aria-label="Country search"
            />
            <button
              type="submit"
              className="shrink-0 rounded bg-gold px-6 py-3 font-mono text-xs font-bold uppercase tracking-wide text-bg"
            >
              Browse countries
            </button>
          </form>
          <p className="font-sans text-sm text-muted">
            Tip: rankings and compare are linked from the main navigation for sortable metrics across 261 entities.
          </p>
        </section>

        <section className="mt-14 rounded-lg border border-gold/30 bg-bg2/60 p-8">
          <h2 className="font-display text-2xl font-semibold text-cream">Free API</h2>
          <p className="mt-3 font-sans text-base leading-[1.8] text-cream/90">
            Every headline field is available as JSON — no API key, open CORS, weekly refresh. Build dashboards, LLM tools,
            or research pipelines on the same data that powers the site.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/api-docs/"
              className="inline-flex rounded border-2 border-gold px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-gold hover:bg-gold/10"
            >
              API documentation
            </Link>
            <a
              href={`${SITE_URL}/api/v1/countries/`}
              className="inline-flex rounded border border-bg4 px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-cream hover:border-gold/50"
            >
              GET /api/v1/countries/
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
