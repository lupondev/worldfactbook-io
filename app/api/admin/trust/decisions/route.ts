import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/requireAdmin";
import { isMissingTableError } from "@/lib/api-db";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const queue = url.searchParams.get("queue") || "review";

  try {
    if (queue === "review") {
      const items = await prisma.decision.findMany({
        where: { trustStatus: "ai_generated" },
        orderBy: { impactScore: "desc" },
        take: 200,
        include: { signals: true },
      });
      return NextResponse.json({
        ok: true,
        queue,
        items: items.map((d) => ({
          id: d.id,
          articleId: d.articleId,
          slug: d.slug,
          title: d.title,
          trustStatus: d.trustStatus,
          impactScore: d.impactScore,
          aiConfidence: d.aiConfidence,
          version: d.version,
          needsDiffReview: d.needsDiffReview,
          editorUrl:
            d.slug != null && d.slug.length > 0
              ? `/newsroom?focus=${encodeURIComponent(d.slug)}`
              : `/newsroom?focus=${encodeURIComponent(d.id)}`,
          updatedAt: d.updatedAt.toISOString(),
        })),
      });
    }

    if (queue === "changes") {
      const items = await prisma.decision.findMany({
        where: { version: { gt: 1 } },
        orderBy: { updatedAt: "desc" },
        take: 200,
      });
      return NextResponse.json({
        ok: true,
        queue,
        items: items.map((d) => ({
          id: d.id,
          articleId: d.articleId,
          slug: d.slug,
          title: d.title,
          trustStatus: d.trustStatus,
          impactScore: d.impactScore,
          version: d.version,
          needsDiffReview: d.needsDiffReview,
          diffUrl: `/admin/trust/decision/${d.id}`,
          editorUrl:
            d.slug != null && d.slug.length > 0
              ? `/newsroom?focus=${encodeURIComponent(d.slug)}`
              : `/newsroom?focus=${encodeURIComponent(d.id)}`,
          updatedAt: d.updatedAt.toISOString(),
        })),
      });
    }

    return NextResponse.json({ error: 'Invalid queue — use "review" or "changes"' }, { status: 400 });
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ ok: true, queue, items: [], message: "Migration pending" });
    }
    console.error("trust decisions list", error);
    return NextResponse.json({ error: "Failed to load decisions" }, { status: 500 });
  }
}
