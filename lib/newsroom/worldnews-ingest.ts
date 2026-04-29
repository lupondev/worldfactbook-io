import { prisma } from "@/lib/prisma";
import { checkSourceAllowed } from "@/lib/newsroom/source-filter";

export type IngestResult =
  | { skipped: true; reason: string }
  | { skipped: false; reason: string };

export async function ingestWorldNewsSource(sourceUrl: string): Promise<IngestResult> {
  const sourceCheck = checkSourceAllowed(sourceUrl);
  if (!sourceCheck.allowed) {
    console.log(`[ingest] BLOCKED: ${sourceUrl} - ${sourceCheck.reason}`);
    await prisma.ingestLog
      .create({
        data: {
          sourceUrl,
          action: "blocked",
          reason: sourceCheck.reason,
          sourceDomain: sourceCheck.source?.domain || "unknown",
        },
      })
      .catch(() => undefined);
    return { skipped: true, reason: sourceCheck.reason };
  }

  await prisma.ingestLog
    .create({
      data: {
        sourceUrl,
        action: "allowed",
        reason: sourceCheck.reason,
        sourceDomain: sourceCheck.source?.domain || "unknown",
      },
    })
    .catch(() => undefined);

  return { skipped: false, reason: sourceCheck.reason };
}
