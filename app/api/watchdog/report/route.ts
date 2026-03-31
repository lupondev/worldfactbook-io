import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const totalCountries = await prisma.country.count();
    return NextResponse.json({
      ok: true,
      watchdog: {
        status: "healthy",
        checkedAt: new Date().toISOString(),
        totalCountries,
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
