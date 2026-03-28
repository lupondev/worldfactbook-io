/**
 * Batch-generate Claude summaries for countries missing aiSummary.
 * Run: npx ts-node scripts/generate-ai-summaries.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import { generateCountrySummary } from "../lib/ai/summary";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set; aborting.");
    process.exit(1);
  }

  const countries = await prisma.country.findMany({
    where: { aiSummary: null },
    orderBy: { name: "asc" },
  });

  console.log(`Generating AI summaries for ${countries.length} countries...`);

  for (const country of countries) {
    try {
      const summary = await generateCountrySummary(country);
      await prisma.country.update({
        where: { id: country.id },
        data: { aiSummary: summary, aiUpdatedAt: new Date() },
      });
      console.log(`✓ ${country.name}`);
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      console.error(`✗ ${country.name}:`, e);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
