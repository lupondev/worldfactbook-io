import type { Metadata } from "next";

import { CopyButton } from "@/components/CopyButton";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free REST API - World Factbook",
  description: "JSON API for all countries — no API key required. Open CORS, weekly refresh.",
  alternates: { canonical: "/api-docs/" },
};

const EXAMPLE_LIST = `[
  {
    "name": "Germany",
    "slug": "germany",
    "flag": "🇩🇪",
    "region": "Europe",
    "capital": "Berlin",
    "gdp": 4600,
    "gdpPerCapita": 54500,
    "population": "84400000",
    "hdiScore": 0.942,
    "democracyScore": 96,
    "corruptionIndex": 78,
    "dataUpdatedAt": "2026-03-01T12:00:00.000Z"
  }
]`;

const EXAMPLE_ONE = `{
  "name": "Germany",
  "slug": "germany",
  "flag": "🇩🇪",
  "region": "Europe",
  "gdp": 4600,
  "population": "84400000",
  "capital": "Berlin",
  "area": 357022,
  "introduction": "…",
  "geography": { },
  "economy": { },
  "government": { },
  "military": { },
  "aiSummary": "…"
}`;

function CodeBlock({ code, curl }: { code: string; curl: string }) {
  return (
    <div className="space-y-3">
      <pre className="overflow-x-auto rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg3 p-4 font-mono text-xs leading-relaxed text-cream/90">
        {code}
      </pre>
      <div className="flex flex-wrap items-center gap-2">
        <CopyButton text={code} />
      </div>
      <p className="font-mono text-[9px] uppercase tracking-wider text-muted">cURL</p>
      <pre className="overflow-x-auto rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg3 p-4 font-mono text-[11px] text-gold2/90">
        {curl}
      </pre>
      <CopyButton text={curl} />
    </div>
  );
}

export default function ApiDocsPage() {
  const base = `${SITE_URL}/api/v1/countries`;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <header className="mb-12 border-b border-[0.5px] border-[color:var(--line)] pb-8">
          <h1 className="font-display text-[36px] font-semibold text-cream">Free REST API</h1>
          <p className="mt-3 font-mono text-sm uppercase tracking-wider text-gold">No API key required</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Open JSON endpoints with CORS enabled. Data mirrors the public country profiles and list view; fields may expand
            as pipelines add indicators.
          </p>
        </header>

        <div className="space-y-12">
          <section className="rounded-lg border-l-4 border-gold bg-bg2/90 p-6 pl-5 shadow-[inset_1px_0_0_var(--line)]">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-gold">GET /api/v1/countries/</h2>
            <p className="mt-2 text-sm text-muted">Returns an array of all countries with headline fields for grids and rankings.</p>
            <div className="mt-6">
              <CodeBlock
                code={EXAMPLE_LIST}
                curl={`curl -s "${base}/"`}
              />
            </div>
          </section>

          <section className="rounded-lg border-l-4 border-gold bg-bg2/90 p-6 pl-5 shadow-[inset_1px_0_0_var(--line)]">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-gold">GET /api/v1/countries/[slug]/</h2>
            <p className="mt-2 text-sm text-muted">
              Returns the full normalized country record (Factbook JSON sections, merged metrics, AI summary when present).
            </p>
            <div className="mt-6">
              <CodeBlock code={EXAMPLE_ONE} curl={`curl -s "${base}/germany/"`} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
