import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { RankingsTable } from "@/components/RankingsTable";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const RANKINGS_DESCRIPTION =
  "Sort 260+ countries by GDP, GDP per capita, population, HDI, democracy score, and corruption index — WorldFactbook.io.";

export const metadata: Metadata = {
  title: "Country Rankings - The World Factbook",
  description: RANKINGS_DESCRIPTION,
  alternates: { canonical: "/rankings/" },
  openGraph: {
    title: "Country Rankings | WorldFactbook.io",
    description: "Sortable rankings across key World Factbook indicators.",
    url: `${SITE_URL}/rankings/`,
  },
};

export default async function RankingsPage() {
  const raw = await prisma.country.findMany({
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
        <header className="mb-8 border-b border-bg4 pb-6">
          <h1 className="font-display text-4xl text-cream">Country rankings</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Click column headers to sort. Data is parsed from the CIA World Factbook JSON corpus; HDI, democracy, and
            corruption fields are reserved for merged open datasets.
          </p>
        </header>
        <RankingsTable countries={countries} />
      </main>
      <Footer />
    </>
  );
}
