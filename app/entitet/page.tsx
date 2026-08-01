import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { Suspense } from "react";

import { EntitiesIndexShell } from "@/components/entities/EntitiesIndexShell";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = false;

function roleFromMeta(meta: Prisma.JsonValue | null | undefined): string | null {
  if (meta == null || typeof meta !== "object" || Array.isArray(meta)) return null;
  const r = (meta as Record<string, unknown>).role;
  return typeof r === "string" ? r : null;
}

function avatarFromMeta(meta: Prisma.JsonValue | null | undefined): string | null {
  if (meta == null || typeof meta !== "object" || Array.isArray(meta)) return null;
  const r = (meta as Record<string, unknown>).avatar;
  return typeof r === "string" ? r : null;
}

export const metadata: Metadata = {
  title: "Entities — knowledge graph",
  description: "Public index of tracked persons, organizations, and events.",
  alternates: { canonical: `${SITE_URL}/entitet/` },
};

export default async function EntitiesIndexPage() {
  const [rows, typeRows] = await Promise.all([
    prisma.entity.findMany({
      orderBy: { nameBs: "asc" },
      select: {
        slug: true,
        nameBs: true,
        type: true,
        shortBio: true,
        imageUrl: true,
        metadata: true,
        _count: {
          select: {
            entityDecisions: true,
            entityArticles: true,
            outgoingRelations: true,
            incomingRelations: true,
          },
        },
      },
    }),
    prisma.entity.findMany({
      distinct: ["type"],
      select: { type: true },
      orderBy: { type: "asc" },
    }),
  ]);

  const entities = rows.map((r) => ({
    slug: r.slug,
    nameBs: r.nameBs,
    type: r.type,
    role: roleFromMeta(r.metadata),
    shortBio: r.shortBio,
    imageUrl: r.imageUrl,
    avatar: avatarFromMeta(r.metadata),
    counts: {
      decisions: r._count.entityDecisions,
      articles: r._count.entityArticles,
      relations: r._count.outgoingRelations + r._count.incomingRelations,
    },
  }));

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 md:px-6 md:pt-12">
        <Suspense
          fallback={
            <header className="border-b border-[color:var(--line)] pb-10">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-cream md:text-4xl">Entities</h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-cream/75">Loading entities…</p>
            </header>
          }
        >
          <EntitiesIndexShell rows={entities} types={typeRows.map((t) => t.type)} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
