import { NextResponse } from "next/server";

import { isMissingTableError } from "@/lib/api-db";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await prisma.country.count();
    return NextResponse.json({ ok: true, count, pending: 0, topSuggestions: [] });
  } catch (err) {
    if (isMissingTableError(err)) {
      return NextResponse.json({ count: 0, pending: 0, topSuggestions: [], message: "Migration pending", data: [] });
    }
    return NextResponse.json({ count: 0, pending: 0, topSuggestions: [] });
  }
}
