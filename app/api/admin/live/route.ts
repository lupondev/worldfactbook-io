import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/requireAdmin";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const items = await prisma.liveBlog.findMany({
    where: { deletedAt: null },
    orderBy: [{ startedAt: "desc" }, { createdAt: "desc" }],
    take: 100,
  });
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const body = (await request.json()) as {
    siteId: string;
    slug: string;
    title: string;
    subtitle?: string;
    description: string;
    templateType?: string;
    status?: string;
    aiTopics?: string[];
  };
  const item = await prisma.liveBlog.create({
    data: {
      siteId: body.siteId,
      slug: body.slug,
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      templateType: body.templateType || "generic",
      status: body.status || "draft",
      aiTopics: body.aiTopics || [],
      startedAt: body.status === "live" ? new Date() : null,
    },
  });
  return NextResponse.json(item);
}
