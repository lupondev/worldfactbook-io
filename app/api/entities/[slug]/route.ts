import { NextRequest, NextResponse } from "next/server";

import { fetchEntityWithGraph, serializeEntity } from "@/lib/entities-public";

export const dynamic = "force-dynamic";

type Ctx = { params: { slug: string } };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const slug = ctx.params.slug;
  const row = await fetchEntityWithGraph(slug);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serializeEntity(row));
}
