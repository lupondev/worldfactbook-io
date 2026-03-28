import { PrismaClient } from '@prisma/client'

import { getAllPosts } from '@/lib/blog'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export default async function sitemap() {
  const countries = await prisma.country.findMany({
    select: { slug: true, updatedAt: true }
  })

  const countryUrls = countries.map((c) => ({
    url: `https://worldfactbook.io/countries/${c.slug}/`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const posts = getAllPosts()
  const blogIndex = {
    url: 'https://worldfactbook.io/blog/',
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }
  const blogPosts = posts.map((p) => ({
    url: `https://worldfactbook.io/blog/${p.slug}/`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  return [
    {
      url: 'https://worldfactbook.io/',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: 'https://worldfactbook.io/countries/',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: 'https://worldfactbook.io/rankings/',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: 'https://worldfactbook.io/compare/',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: 'https://worldfactbook.io/ai-country-intelligence/',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    blogIndex,
    ...blogPosts,
    ...countryUrls,
  ]
}
