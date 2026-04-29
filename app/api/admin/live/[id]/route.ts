import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/requireAdmin";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const body = (await request.json()) as Record<string, unknown>;
  const updated = await prisma.liveBlog.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  await prisma.liveBlog.update({
    where: { id: params.id },
    data: { deletedAt: new Date(), status: "archived" },
  });
  return NextResponse.json({ ok: true });
}
