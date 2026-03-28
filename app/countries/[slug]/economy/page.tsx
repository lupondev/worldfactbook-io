import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CountryProfile } from "@/components/CountryProfile";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const c = await prisma.country.findUnique({ where: { slug } });
  if (!c) return { title: "Country not found" };
  const title = `${c.name} - Economy - The World Factbook`;
  const description = `Economy of ${c.name}: GDP, labor, trade, budget, and debt — World Factbook.`;
  return {
    title,
    description,
    alternates: { canonical: `/countries/${c.slug}/economy/` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/countries/${c.slug}/economy/`,
    },
  };
}

export default async function EconomyPage({ params }: Props) {
  const { slug } = params;
  const country = await prisma.country.findUnique({ where: { slug } });
  if (!country) notFound();
  return <CountryProfile country={country} focus="economy" />;
}
