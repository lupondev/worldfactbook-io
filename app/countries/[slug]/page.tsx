import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CountryProfile } from "@/components/CountryProfile";
import { formatBillions, formatInt } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

function countryMetaDescription(c: {
  name: string;
  gdp: number | null;
  population: bigint | null;
  democracyScore: number | null;
}): string {
  const gdp = formatBillions(c.gdp);
  const pop = formatInt(c.population);
  const demo = c.democracyScore != null ? String(c.democracyScore) : null;
  const head = `${c.name} country profile: GDP ${gdp}, population ${pop}`;
  const mid = demo ? `, democracy score ${demo}` : "";
  return `${head}${mid}, government, geography and economy data. Updated weekly from World Bank and IMF.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const c = await prisma.country.findUnique({ where: { slug } });
  if (!c) return { title: "Country not found" };
  const title = `${c.name} — World Factbook | WorldFactbook.io`;
  const description = countryMetaDescription(c);
  const keywords = [
    `${c.name} world factbook`,
    `${c.name} country data 2026`,
    `${c.name} CIA factbook alternative`,
  ];
  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/countries/${c.slug}/` },
    openGraph: {
      title: `${c.name} | WorldFactbook.io`,
      description,
      url: `${SITE_URL}/countries/${c.slug}/`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${c.name} | WorldFactbook.io`,
      description,
    },
  };
}

export default async function CountryPage({ params }: Props) {
  const { slug } = params;
  const country = await prisma.country.findUnique({ where: { slug } });
  if (!country) notFound();
  return <CountryProfile country={country} focus="main" />;
}
