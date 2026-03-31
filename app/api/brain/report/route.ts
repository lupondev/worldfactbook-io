import { NextResponse } from "next/server";

import { isMissingTableError } from "@/lib/api-db";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const reports = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      `select "id","status","summary","report","createdAt"
       from "BrainReport"
       order by "createdAt" desc
       limit 20`,
    );
    return NextResponse.json({ ok: true, reports });
  } catch (e) {
    console.error("[brain/report]", e);
    if (isMissingTableError(e)) {
      return NextResponse.json({ reports: [], message: "Migration pending" });
    }
    return NextResponse.json({ reports: [], message: "Migration pending" });
  }
}
