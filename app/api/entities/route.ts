import { type Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function roleFromMeta(meta: Prisma.JsonValue | null | undefined): string | null {
  if (meta == null || typeof meta !== "object" || Array.isArray(meta)) return null;
  const r = (meta as Record<string, unknown>).role;
  return typeof r === "string" ? r : null;
}

function activeFromIsoFromMeta(meta: Prisma.JsonValue | null | undefined): string | null {
  if (meta == null || typeof meta !== "object" || Array.isArray(meta)) return null;
  const r = (meta as Record<string, unknown>).activeFromIso;
  return typeof r === "string" ? r : null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type")?.trim();
  const q = searchParams.get("q")?.trim() ?? "";

  const where: Prisma.EntityWhereInput = {};
  if (type) where.type = type;
  if (q) where.nameBs = { contains: q, mode: "insensitive" };

  const rows = await prisma.entity.findMany({
    where,
    orderBy: { nameBs: "asc" },
    take: 250,
    select: {
      id: true,
      slug: true,
      nameBs: true,
      type: true,
      shortBio: true,
      imageUrl: true,
      metadata: true,
      _count: {
        select: {
          entityDecisions: true,
          entityArticles: true,
          outgoingRelations: true,
          incomingRelations: true,
        },
      },
    },
  });

  const items = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    nameBs: r.nameBs,
    type: r.type,
    role: roleFromMeta(r.metadata),
    shortBio: r.shortBio,
    imageUrl: r.imageUrl,
    avatar: null as string | null,
    activeFrom: activeFromIsoFromMeta(r.metadata),
    counts: {
      decisions: r._count.entityDecisions,
      articles: r._count.entityArticles,
      relations: r._count.outgoingRelations + r._count.incomingRelations,
    },
  }));

  return NextResponse.json({ items });
}
