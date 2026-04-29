import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const blog = await prisma.liveBlog.findUnique({
    where: { slug: params.slug },
    include: {
      updates: {
        where: { status: "published", deletedAt: null },
        orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
        take: 200,
      },
    },
  });
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(blog);
}
