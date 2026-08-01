import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CountryProfile } from "@/components/CountryProfile";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";
import { countryStaticParams } from "@/lib/static-build";

export const dynamic = "force-static";
export const revalidate = false;
export const dynamicParams = false;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return countryStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const c = await prisma.country.findUnique({ where: { slug } });
  if (!c) return { title: "Country not found" };
  const title = `${c.name} - Military - The World Factbook`;
  const description = `Military and security notes for ${c.name} — World Factbook.`;
  return {
    title,
    description,
    alternates: { canonical: `/countries/${c.slug}/military/` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/countries/${c.slug}/military/`,
    },
  };
}

export default async function MilitaryPage({ params }: Props) {
  const { slug } = params;
  const country = await prisma.country.findUnique({ where: { slug } });
  if (!country) notFound();
  return <CountryProfile country={country} focus="military" />;
}
