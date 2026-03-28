import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const SECTIONS = ["geography", "economy", "government", "people-and-society", "military"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = await prisma.country.findMany({
    select: { slug: true, updatedAt: true },
  });

  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL + "/", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: SITE_URL + "/rankings/", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: SITE_URL + "/compare/", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: SITE_URL + "/ai-intel/", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  for (const c of countries) {
    entries.push({
      url: `${SITE_URL}/countries/${c.slug}/`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.85,
    });
    for (const s of SECTIONS) {
      entries.push({
        url: `${SITE_URL}/countries/${c.slug}/${s}/`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly",
        priority: 0.75,
      });
    }
  }

  return entries;
}
