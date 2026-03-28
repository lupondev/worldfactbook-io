import type { Metadata } from "next";

import { CompareClient } from "@/components/CompareClient";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { toCountryPublic } from "@/lib/country-public";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const COMPARE_DESC = "Compare two countries side by side: GDP, population, HDI, democracy, and Factbook sections.";

export const metadata: Metadata = {
  title: "Compare Countries - The World Factbook",
  description: COMPARE_DESC,
  alternates: { canonical: "/compare/" },
  openGraph: {
    title: "Compare countries | WorldFactbook.io",
    description: COMPARE_DESC,
    url: `${SITE_URL}/compare/`,
  },
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: { a?: string; b?: string };
}) {
  const options = await prisma.country.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true, flag: true },
  });

  const resolve = (q: string | undefined, preferred: string, alt: string) => {
    if (q && options.some((o) => o.slug === q)) return q;
    if (options.some((o) => o.slug === preferred)) return preferred;
    if (options.some((o) => o.slug === alt)) return alt;
    return options[0]?.slug ?? preferred;
  };

  const aSlug = resolve(searchParams.a, "germany", "united-states");
  const bSlug = resolve(searchParams.b, "france", "japan");

  const [left, right] = await Promise.all([
    prisma.country.findUnique({ where: { slug: aSlug } }),
    prisma.country.findUnique({ where: { slug: bSlug } }),
  ]);

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
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <header className="mb-8 border-b border-bg4 pb-6">
          <h1 className="font-display text-4xl text-cream">Compare</h1>
          <p className="mt-2 text-sm text-muted">Pick any two Factbook entities and compare headline indicators.</p>
        </header>
        <CompareClient
          options={options}
          initialA={aSlug}
          initialB={bSlug}
          left={left ? toCountryPublic(left) : null}
          right={right ? toCountryPublic(right) : null}
        />
      </main>
      <Footer />
    </>
  );
}
