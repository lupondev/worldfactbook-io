/**
 * Batch-generate Claude summaries for countries missing aiSummary.
 * Run: npx ts-node scripts/generate-ai-summaries.ts
 */
import "dotenv/config";

import { generateCountrySummary, heuristicCountrySummary } from "../lib/ai/summary";
import { createScriptPrismaClient } from "../lib/prisma-script";

const prisma = createScriptPrismaClient();

async function main() {
  const useLlm = Boolean(process.env.ANTHROPIC_API_KEY?.trim());
  if (!useLlm) {
    console.warn("ANTHROPIC_API_KEY not set — using Factbook-derived heuristic summaries.");
  }

  const countries = await prisma.country.findMany({
    where: { aiSummary: null },
    orderBy: { name: "asc" },
  });

  console.log(`Writing summaries for ${countries.length} countries (${useLlm ? "Claude" : "heuristic"})…`);

  for (const country of countries) {
    try {
      const summary = useLlm ? await generateCountrySummary(country) : heuristicCountrySummary(country);
      await prisma.country.update({
        where: { id: country.id },
        data: { aiSummary: summary, aiUpdatedAt: new Date() },
      });
      console.log(`✓ ${country.name}`);
      if (useLlm) await new Promise((r) => setTimeout(r, 500));
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
