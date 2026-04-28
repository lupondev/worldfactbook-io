import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/requireAdmin";
import { isMissingTableError } from "@/lib/api-db";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIONS = ["fetched", "ai_summarized", "validated", "edited", "published"] as const;
const ACTORS = ["system", "user"] as const;

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize")) || 40));
  const actionFilter = url.searchParams.get("action");
  const actorFilter = url.searchParams.get("actor");

  const where: {
    action?: string;
    actor?: string;
  } = {};

  if (actionFilter && ACTIONS.includes(actionFilter as (typeof ACTIONS)[number])) {
    where.action = actionFilter;
  }
  if (actorFilter && ACTORS.includes(actorFilter as (typeof ACTORS)[number])) {
    where.actor = actorFilter;
  }

  try {
    const [items, total] = await Promise.all([
      prisma.decisionAuditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          decision: {
            select: { id: true, title: true, slug: true, trustStatus: true },
          },
        },
      }),
      prisma.decisionAuditLog.count({ where }),
    ]);

    return NextResponse.json({
      ok: true,
      page,
      pageSize,
      total,
      items: items.map((row) => ({
        id: row.id,
        decisionId: row.decisionId,
        action: row.action,
        actor: row.actor,
        actorLabel: row.actorLabel,
        metadata: row.metadata,
        createdAt: row.createdAt.toISOString(),
        decision: row.decision,
      })),
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({
        ok: true,
        page,
        pageSize,
        total: 0,
        items: [],
        message: "Migration pending",
      });
    }
    console.error("audit-log", error);
    return NextResponse.json({ error: "Failed to load audit log" }, { status: 500 });
  }
}
