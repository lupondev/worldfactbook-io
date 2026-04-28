import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/requireAdmin";
import { isMissingTableError } from "@/lib/api-db";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function lastNDaysInclusive(n: number): string[] {
  const out: string[] = [];
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const t = new Date(now);
    t.setUTCDate(t.getUTCDate() - i);
    out.push(isoDay(t));
  }
  return out;
}

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const total = await prisma.decision.count();
    const validatedCount = await prisma.decision.count({ where: { editorValidated: true } });
    const pendingCount = await prisma.decision.count({ where: { trustStatus: "ai_generated" } });
    const editorValidatedPct =
      total === 0 ? 0 : Math.round((validatedCount / total) * 1000) / 10;

    const avgRow = await prisma.decision.aggregate({
      _avg: { aiConfidence: true },
    });
    const aiConfidenceAvg =
      avgRow._avg.aiConfidence == null ? null : Math.round(avgRow._avg.aiConfidence * 1000) / 1000;

    const pendingRatio = total === 0 ? 0 : pendingCount / total;
    const trustScoreRaw =
      editorValidatedPct * 0.4 +
      (aiConfidenceAvg ?? 72) * 0.35 +
      Math.max(0, 100 - pendingRatio * 100) * 0.25;
    const trustScore = Math.max(0, Math.min(100, Math.round(trustScoreRaw * 10) / 10));

    const dayKeys = lastNDaysInclusive(14);
    const start = new Date(dayKeys[0] + "T00:00:00.000Z");

    const ingestRows = await prisma.$queryRaw<Array<{ day: Date; count: bigint }>>`
      SELECT date_trunc('day', "createdAt")::date AS day, COUNT(*)::bigint AS count
      FROM "Decision"
      WHERE "createdAt" >= ${start}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const validatedRows = await prisma.$queryRaw<Array<{ day: Date; count: bigint }>>`
      SELECT date_trunc('day', "createdAt")::date AS day, COUNT(*)::bigint AS count
      FROM "DecisionAuditLog"
      WHERE "action" = 'validated'
        AND "createdAt" >= ${start}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const ingestMap = new Map<string, number>();
    for (const row of ingestRows) {
      ingestMap.set(isoDay(new Date(row.day)), Number(row.count));
    }
    const validatedMap = new Map<string, number>();
    for (const row of validatedRows) {
      validatedMap.set(isoDay(new Date(row.day)), Number(row.count));
    }

    const dailyDecisionsIngested = dayKeys.map((d) => ({
      date: d,
      count: ingestMap.get(d) ?? 0,
    }));

    let rolling = 0;
    const validationBacklog = dayKeys.map((d) => {
      const ing = ingestMap.get(d) ?? 0;
      const val = validatedMap.get(d) ?? 0;
      rolling += ing - val;
      if (rolling < 0) rolling = 0;
      return { date: d, backlog: rolling };
    });

    return NextResponse.json({
      ok: true,
      totals: {
        totalDecisions: total,
        editorValidatedPct,
        aiConfidenceAvg,
        trustScore,
        pendingValidations: pendingCount,
        validatedDecisions: validatedCount,
      },
      charts: {
        dailyDecisionsIngested,
        validationBacklog,
      },
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({
        ok: true,
        totals: {
          totalDecisions: 0,
          editorValidatedPct: 0,
          aiConfidenceAvg: null,
          trustScore: 0,
          pendingValidations: 0,
          validatedDecisions: 0,
        },
        charts: {
          dailyDecisionsIngested: lastNDaysInclusive(14).map((date) => ({ date, count: 0 })),
          validationBacklog: lastNDaysInclusive(14).map((date) => ({ date, backlog: 0 })),
        },
        message: "Migration pending",
      });
    }
    console.error("trust stats", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
