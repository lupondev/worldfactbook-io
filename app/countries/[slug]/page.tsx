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
  const title = `${c.name} - The World Factbook`;
  const description =
    c.introduction?.slice(0, 155) ||
    `${c.name}: geography, people, economy, government, and military — World Factbook format on WorldFactbook.io.`;
  return {
    title,
    description,
    alternates: { canonical: `/countries/${c.slug}/` },
    openGraph: {
      title: `${c.name} | WorldFactbook.io`,
      description,
      url: `${SITE_URL}/countries/${c.slug}/`,
    },
  };
}

export default async function CountryPage({ params }: Props) {
  const { slug } = params;
  const country = await prisma.country.findUnique({ where: { slug } });
  if (!country) notFound();
  return <CountryProfile country={country} focus="main" />;
}
