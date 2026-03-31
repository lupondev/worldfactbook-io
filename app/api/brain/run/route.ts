import { NextResponse } from "next/server";

import { runBrainReport } from "@/lib/ai-editor/brain";
import { decideArticle } from "@/lib/ai-editor/decision-engine";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const report = await runBrainReport();
    const decision = decideArticle({
      title: "Global economic outlook weekly update",
      source: "internal",
      publishedAt: new Date().toISOString(),
      clusterScore: 72,
    });
    await prisma.$executeRawUnsafe(
      `insert into "BrainReport" ("id","status","summary","report","createdAt")
       values (gen_random_uuid()::text,$1,$2,$3::jsonb,now())`,
      decision.shouldPublish ? "ok" : "hold",
      report.summary,
      JSON.stringify({ report, decision }),
    ).catch(() => null);
    return NextResponse.json({ ok: true, report, decision });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
