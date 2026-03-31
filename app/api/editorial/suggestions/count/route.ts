import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await prisma.country.count();
    return NextResponse.json({ ok: true, count });
  } catch (err) {
    return NextResponse.json({ ok: false, count: 0, error: String(err) }, { status: 500 });
  }
}
