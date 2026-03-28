import { PrismaClient } from '@prisma/client'

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
    ...countryUrls,
  ]
}
