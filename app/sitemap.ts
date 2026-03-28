import type { MetadataRoute } from "next";

import { getAllPosts } from "@/lib/blog";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = await prisma.country.findMany({
    select: { slug: true, updatedAt: true },
  });

  const countryUrls: MetadataRoute.Sitemap = countries.map((c) => ({
    url: `https://worldfactbook.io/countries/${c.slug}/`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const posts = getAllPosts();
  const blogIndex: MetadataRoute.Sitemap[number] = {
    url: "https://worldfactbook.io/blog/",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  };
  const blogPosts: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `https://worldfactbook.io/blog/${p.slug}/`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [
    {
      url: "https://worldfactbook.io/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://worldfactbook.io/countries/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://worldfactbook.io/rankings/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://worldfactbook.io/compare/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://worldfactbook.io/ai-country-intelligence/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    blogIndex,
    ...blogPosts,
    ...countryUrls,
  ];
}
