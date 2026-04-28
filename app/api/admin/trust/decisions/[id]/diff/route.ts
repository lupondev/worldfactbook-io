import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/requireAdmin";
import { isMissingTableError } from "@/lib/api-db";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  outcome?: "approve" | "reject";
};

/** Approve or reject a diff for version > 1 decisions (editor workflow). */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as Body;
  const outcome = body.outcome;
  if (outcome !== "approve" && outcome !== "reject") {
    return NextResponse.json({ error: 'Body must include "outcome": "approve" | "reject"' }, { status: 400 });
  }

  try {
    const existing = await prisma.decision.findUnique({ where: { id: params.id } });
    if (!existing || existing.version <= 1) {
      return NextResponse.json({ error: "Decision not found or not a change revision" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      if (outcome === "approve") {
        await tx.decision.update({
          where: { id: params.id },
          data: {
            needsDiffReview: false,
            editorValidated: true,
            trustStatus: "editor_validated",
          },
        });
        await tx.decisionAuditLog.create({
          data: {
            decisionId: params.id,
            action: "validated",
            actor: "user",
            metadata: { source: "diff_approval", version: existing.version },
          },
        });
      } else {
        await tx.decision.update({
          where: { id: params.id },
          data: {
            needsDiffReview: false,
            trustStatus: "rejected",
          },
        });
        await tx.decisionAuditLog.create({
          data: {
            decisionId: params.id,
            action: "edited",
            actor: "user",
            metadata: { source: "diff_reject", version: existing.version },
          },
        });
      }
    });

    return NextResponse.json({ ok: true, outcome });
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ error: "Migration pending" }, { status: 503 });
    }
    console.error("diff PATCH", error);
    return NextResponse.json({ error: "Failed to update decision" }, { status: 500 });
  }
}
