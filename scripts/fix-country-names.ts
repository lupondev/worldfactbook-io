import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function main() {
  console.log('Fetching REST Countries...')
  const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flag')
  const rest = await res.json()

  const byIso2 = new Map(rest.map((c: any) => [c.cca2?.toLowerCase(), c]))
  const byIso3 = new Map(rest.map((c: any) => [c.cca3?.toLowerCase(), c]))
  const byFlag = new Map(rest.map((c: any) => [c.flag, c]))

  const countries = await prisma.country.findMany()
  let updated = 0

  for (const country of countries) {
    const match = byIso2.get(country.iso2?.toLowerCase()) 
      || byIso3.get(country.iso3?.toLowerCase())
      || byFlag.get(country.flag)
    
    if (!match || match.name.common === country.name) continue

    const englishName = match.name.common
    try {
      await prisma.country.update({
        where: { id: country.id },
        data: { name: englishName, slug: slugify(englishName) }
      })
      console.log(`✓ ${country.name} → ${englishName}`)
      updated++
    } catch(e) {
      console.error(`✗ ${country.name}:`, e)
    }
  }
  
  console.log(`Updated: ${updated}`)
  await prisma.$disconnect()
}

main().catch(console.error)
