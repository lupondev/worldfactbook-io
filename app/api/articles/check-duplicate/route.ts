import { NextResponse } from "next/server";

import { isLikelyDuplicate } from "@/lib/ai-editor/duplicate-checker";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { title?: string };
    const title = body.title?.trim() || "";
    if (!title) return NextResponse.json({ ok: false, error: "title_required" }, { status: 400 });
    const existing = await prisma.country.findMany({
      select: { name: true },
      take: 200,
      orderBy: { updatedAt: "desc" },
    });
    const duplicate = isLikelyDuplicate(
      title,
      existing.map((x) => x.name),
    );
    return NextResponse.json({ ok: true, duplicate });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
