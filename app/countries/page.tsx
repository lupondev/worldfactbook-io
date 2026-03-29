import type { Metadata } from "next";

import { CountriesGridClient, type CountryCardRow } from "@/components/CountriesGridClient";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const DESC = "Browse all countries and territories in World Factbook format — filter by region, search, and sort.";

export const metadata: Metadata = {
  title: "Countries - World Factbook",
  description: DESC,
  alternates: { canonical: "https://worldfactbook.io/countries/" },
  openGraph: {
    title: "Countries | WorldFactbook.io",
    description: DESC,
    url: `${SITE_URL}/countries/`,
  },
};

export default async function CountriesPage({ searchParams }: { searchParams: { ai?: string } }) {
  const aiOnly = searchParams.ai === "1" || searchParams.ai === "true";

  const raw = await prisma.country.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      flag: true,
      region: true,
      gdp: true,
      population: true,
      democracyScore: true,
      hdiScore: true,
      dataUpdatedAt: true,
      aiSummary: true,
    },
  });

  const list = aiOnly ? raw.filter((c) => c.aiSummary && c.aiSummary.trim().length > 0) : raw;

  const countries: CountryCardRow[] = list.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    flag: c.flag,
    region: c.region,
    gdp: c.gdp,
    population: c.population != null ? c.population.toString() : null,
    democracyScore: c.democracyScore,
    hdiScore: c.hdiScore,
    dataUpdatedAt: c.dataUpdatedAt.toISOString(),
  }));

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <header className="mb-10 border-b border-[0.5px] border-[color:var(--line)] pb-8">
          <h1 className="font-display text-[36px] font-semibold text-cream">Countries</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            {aiOnly
              ? "Countries with an AI intelligence summary available. Use the main Countries link to see the full directory."
              : "Full grid of all entities in the database — same cards as the homepage feature strip, with region tabs and sorting."}
          </p>
        </header>
        <CountriesGridClient countries={countries} />
      </main>
      <Footer />
    </>
  );
}
