import { NextResponse } from "next/server";

import { isMissingTableError } from "@/lib/api-db";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      `select "id","runType","status","message","createdAt"
       from "AutopilotLog"
       order by "createdAt" desc
       limit 20`,
    );
    return NextResponse.json({ ok: true, logs });
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ ok: true, logs: [], message: "Migration pending" });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { runType?: string; status?: string; message?: string; metadata?: unknown };
    const runType = body.runType || "manual";
    const status = body.status || "ok";
    const message = body.message || "";
    const metadata = body.metadata ? JSON.stringify(body.metadata) : JSON.stringify({});
    await prisma.$executeRawUnsafe(
      `insert into "AutopilotLog" ("id","runType","status","message","metadata","createdAt")
       values (gen_random_uuid()::text,$1,$2,$3,$4::jsonb,now())`,
      runType,
      status,
      message,
      metadata,
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (isMissingTableError(err)) {
      return NextResponse.json({ ok: true, logs: [], message: "Migration pending" });
    }
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
