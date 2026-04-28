import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { EntityProfileClient } from "@/components/entities/EntityProfileClient";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { fetchEntityWithGraph, serializeEntity } from "@/lib/entities-public";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

function siteHost() {
  try {
    return new URL(SITE_URL).hostname;
  } catch {
    return "worldfactbook.io";
  }
}

function jsonLdFor(entity: ReturnType<typeof serializeEntity>, pageUrl: string) {
  const shared = {
    "@context": "https://schema.org",
    name: entity.nameBs,
    description: entity.shortBio ?? undefined,
    url: pageUrl,
  };
  const k = entity.schemaKind;
  if (k === "Organization") {
    return { ...shared, "@type": "Organization" as const };
  }
  if (k === "Event") {
    return { ...shared, "@type": "Event" as const };
  }
  if (k === "AdministrativeArea") {
    return { ...shared, "@type": "AdministrativeArea" as const };
  }
  if (k === "Legislation") {
    return { ...shared, "@type": "Legislation" as const };
  }
  return {
    ...shared,
    "@type": "Person" as const,
    jobTitle: entity.role ?? undefined,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const row = await fetchEntityWithGraph(params.slug);
  if (!row) return { title: "Entity not found" };
  const host = siteHost();
  const rawMeta = row.metadata;
  const metaRole =
    rawMeta && typeof rawMeta === "object" && !Array.isArray(rawMeta) && typeof (rawMeta as { role?: unknown }).role === "string"
      ? (rawMeta as { role: string }).role
      : null;
  const title = `${row.nameBs} — ${metaRole ?? row.type} | ${host}`;
  const description = row.shortBio?.trim() || `${row.nameBs} profile: decisions, articles, and relations.`;
  const url = `${SITE_URL}/entitet/${row.slug}/`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function ProfileFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" aria-busy>
      <div className="h-40 animate-pulse rounded-2xl border border-[color:var(--line)] bg-bg2/60" />
      <div className="mt-10 h-32 animate-pulse rounded-xl border border-[color:var(--line)] bg-bg2/60" />
    </div>
  );
}

export default async function EntityPublicPage({ params }: Props) {
  const row = await fetchEntityWithGraph(params.slug);
  if (!row) notFound();
  const serialized = serializeEntity(row);
  const pageUrl = `${SITE_URL}/entitet/${serialized.slug}/`;
  const jsonLd = jsonLdFor(serialized, pageUrl);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <Suspense fallback={<ProfileFallback />}>
        <EntityProfileClient entity={serialized} />
      </Suspense>
      <Footer />
    </>
  );
}
