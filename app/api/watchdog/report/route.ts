import { NextResponse } from "next/server";

import { isMissingTableError } from "@/lib/api-db";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const checks = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      `select "id","status","createdAt"
       from "BrainReport"
       order by "createdAt" desc
       limit 20`,
    );
    return NextResponse.json({
      ok: true,
      status: "healthy",
      checks,
    });
  } catch (err) {
    if (isMissingTableError(err)) {
      return NextResponse.json({ status: "pending_migration", checks: [], message: "Migration pending", data: [] });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
