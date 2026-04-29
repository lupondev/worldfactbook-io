import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/requireAdmin";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const updates = await prisma.liveBlogUpdate.findMany({
    where: { liveBlogId: params.id, deletedAt: null },
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
    take: 500,
  });
  return NextResponse.json({ items: updates });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const body = (await request.json()) as {
    updateType?: string;
    headline?: string;
    body: string;
    importance?: number;
    pinned?: boolean;
    imageUrl?: string;
  };
  const item = await prisma.liveBlogUpdate.create({
    data: {
      liveBlogId: params.id,
      updateType: body.updateType || "manual",
      headline: body.headline,
      body: body.body,
      importance: body.importance ?? 5,
      pinned: body.pinned ?? false,
      imageUrl: body.imageUrl,
      authorType: "human",
      status: "published",
    },
  });
  return NextResponse.json(item);
}
