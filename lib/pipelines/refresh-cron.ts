import type { PrismaClient } from "@prisma/client";

import { generateCountrySummary } from "../ai/summary";
import { syncAllFreedomHouse } from "./freedomhouse";
import { syncAllImf } from "./imf";
import { syncAllWorldBank } from "./worldbank";

function uniq(ids: string[]): string[] {
  return Array.from(new Set(ids));
}

/**
 * Weekly data refresh: World Bank → IMF → Freedom House, then AI summaries for touched rows.
 */
export async function runWeeklyDataRefresh(prisma: PrismaClient): Promise<{
  worldBank: number;
  imf: number;
  freedomHouse: number;
  ai: number;
}> {
  const wb = await syncAllWorldBank(prisma, 100);
  const imf = await syncAllImf(prisma);
  const fh = await syncAllFreedomHouse(prisma);
  const targets = uniq([...wb, ...imf, ...fh]);

  let ai = 0;
  if (process.env.ANTHROPIC_API_KEY && targets.length) {
    const rows = await prisma.country.findMany({
      where: { id: { in: targets } },
    });
    for (const country of rows) {
      try {
        const summary = await generateCountrySummary(country);
        await prisma.country.update({
          where: { id: country.id },
          data: { aiSummary: summary, aiUpdatedAt: new Date() },
        });
        ai += 1;
        await new Promise((r) => setTimeout(r, 500));
      } catch {
        /* skip */
      }
    }
  }

  return { worldBank: wb.length, imf: imf.length, freedomHouse: fh.length, ai };
}
