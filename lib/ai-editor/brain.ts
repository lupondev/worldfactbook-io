import { prisma } from "@/lib/prisma";

export type BrainRunResult = {
  ok: boolean;
  generatedAt: string;
  summary: string;
};

export async function runBrainReport(): Promise<BrainRunResult> {
  const countries = await prisma.country.count().catch(() => 0);
  const summary = `Brain heartbeat OK. Countries in DB: ${countries}.`;
  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    summary,
  };
}
