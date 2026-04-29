import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const siteId = url.searchParams.get("siteId") || "";
  const blogs = await prisma.liveBlog.findMany({
    where: {
      ...(siteId ? { siteId } : {}),
      deletedAt: null,
    },
    orderBy: [{ startedAt: "desc" }, { createdAt: "desc" }],
    take: 50,
  });
  return NextResponse.json({ items: blogs });
}
