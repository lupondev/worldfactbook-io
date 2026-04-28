import Link from "next/link";
import { notFound } from "next/navigation";

import { isMissingTableError } from "@/lib/api-db";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DecisionDiffPage({ params }: { params: { id: string } }) {
  let decision: {
    id: string;
    title: string | null;
    slug: string | null;
    version: number;
    trustStatus: string;
    impactScore: number;
    createdAt: Date;
    updatedAt: Date;
  } | null = null;

  try {
    decision = await prisma.decision.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        slug: true,
        version: true,
        trustStatus: true,
        impactScore: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (e) {
    if (!isMissingTableError(e)) throw e;
  }

  if (!decision) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <p className="font-mono text-xs uppercase tracking-wider text-muted">Decision diff</p>
      <h1 className="mt-2 font-display text-3xl text-cream">{decision.title || decision.slug || decision.id}</h1>
      <dl className="mt-8 space-y-2 font-mono text-sm">
        <div className="flex justify-between gap-4 border-b border-line py-2">
          <dt className="text-muted">Version</dt>
          <dd className="text-cream">{decision.version}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-line py-2">
          <dt className="text-muted">Trust</dt>
          <dd className="text-cream">{decision.trustStatus}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-line py-2">
          <dt className="text-muted">Impact</dt>
          <dd className="text-cream">{decision.impactScore}</dd>
        </div>
      </dl>
      <p className="mt-8 rounded border border-bg4 bg-bg2/70 p-4 font-mono text-xs text-muted">
        Inline body diff previews will render here when editorial content snapshots are wired to Decision.
      </p>
      <Link href="/admin/trust" className="mt-8 inline-block font-mono text-sm text-gold hover:underline">
        ← Trust dashboard
      </Link>
    </main>
  );
}
