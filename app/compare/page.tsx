import type { Metadata } from "next";

import { CompareClient, type CompareCountryRow } from "@/components/CompareClient";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const COMPARE_DESC =
  "Compare two to four countries: GDP, population, HDI rank, democracy, life expectancy, inflation, debt, and literacy.";

export const metadata: Metadata = {
  title: "Compare Countries - World Factbook",
  description: COMPARE_DESC,
  alternates: { canonical: "/compare/" },
  openGraph: {
    title: "Compare countries | WorldFactbook.io",
    description: COMPARE_DESC,
    url: `${SITE_URL}/compare/`,
  },
};

function buildInitialSlugs(slugs: string[], available: Set<string>): string[] {
  const out: string[] = [];
  for (const s of slugs) {
    if (available.has(s) && !out.includes(s)) out.push(s);
  }
  if (out.length >= 2) return out.slice(0, 4);
  for (const s of ["united-states", "germany", "france", "japan"]) {
    if (available.has(s) && !out.includes(s)) out.push(s);
    if (out.length >= 2) break;
  }
  return out.slice(0, 4);
}

export default async function ComparePage() {
  const raw = await prisma.country.findMany({
    orderBy: { name: "asc" },
    select: {
      slug: true,
      name: true,
      flag: true,
      gdp: true,
      gdpPerCapita: true,
      population: true,
      area: true,
      hdiRank: true,
      democracyScore: true,
      lifeExpectancy: true,
      inflation: true,
      publicDebt: true,
      literacyRate: true,
    },
  });

  const countries: CompareCountryRow[] = raw.map((c) => ({
    slug: c.slug,
    name: c.name,
    flag: c.flag,
    gdp: c.gdp,
    gdpPerCapita: c.gdpPerCapita,
    population: c.population != null ? c.population.toString() : null,
    area: c.area,
    hdiRank: c.hdiRank,
    democracyScore: c.democracyScore,
    lifeExpectancy: c.lifeExpectancy,
    inflation: c.inflation,
    publicDebt: c.publicDebt,
    literacyRate: c.literacyRate,
  }));

  const available = new Set(countries.map((c) => c.slug));
  const initialSlugs = buildInitialSlugs(["united-states", "germany"], available);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Compare countries",
    description: COMPARE_DESC,
    url: `${SITE_URL}/compare/`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <header className="mb-10 border-b border-[0.5px] border-[color:var(--line)] pb-8">
          <h1 className="font-display text-[36px] font-semibold text-cream">Compare Countries</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Choose two to four countries; the table lists every selected country as a column. Use Compare to drop duplicates
            and invalid picks. Best-in-row values use a gold outline.
          </p>
        </header>
        <CompareClient countries={countries} initialSlugs={initialSlugs} />
      </main>
      <Footer />
    </>
  );
}
