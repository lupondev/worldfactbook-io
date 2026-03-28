import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { RankingsTable } from "@/components/RankingsTable";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const RANKINGS_DESCRIPTION =
  "Sort 260+ countries by GDP, GDP per capita, population, HDI, democracy score, and corruption — WorldFactbook.io.";

export const metadata: Metadata = {
  title: "World Rankings - World Factbook",
  description: RANKINGS_DESCRIPTION,
  alternates: { canonical: "/rankings/" },
  openGraph: {
    title: "World Rankings | WorldFactbook.io",
    description: RANKINGS_DESCRIPTION,
    url: `${SITE_URL}/rankings/`,
  },
};

export default async function RankingsPage() {
  const raw = await prisma.country.findMany({
    where: { NOT: { OR: [{ slug: "world" }, { name: "World" }] } },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      flag: true,
      region: true,
      gdp: true,
      gdpPerCapita: true,
      population: true,
      hdiRank: true,
      hdiScore: true,
      democracyScore: true,
      corruptionIndex: true,
    },
  });

  const countries = raw.map((c) => ({
    ...c,
    population: c.population != null ? c.population.toString() : null,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "WorldFactbook.io country rankings",
    description: RANKINGS_DESCRIPTION,
    url: `${SITE_URL}/rankings/`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <header className="mb-10 border-b border-[0.5px] border-[color:var(--line)] pb-8">
          <h1 className="font-display text-[36px] font-semibold text-cream">World Rankings</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            All countries and territories, sortable by headline indicators. Default view ranks by GDP (nominal). Use the
            tabs to switch metrics; search filters the list client-side.
          </p>
        </header>
        <RankingsTable countries={countries} />
      </main>
      <Footer />
    </>
  );
}
