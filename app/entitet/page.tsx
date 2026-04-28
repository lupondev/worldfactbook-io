import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";

import { EntityCard } from "@/components/entities/EntityCard";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

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

export default async function EntitiesIndexPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const q = searchParams.q?.trim() ?? "";
  const type = searchParams.type?.trim();

  const where: Prisma.EntityWhereInput = {};
  if (type) where.type = type;
  if (q) where.nameBs = { contains: q, mode: "insensitive" };

  const [rows, typeRows] = await Promise.all([
    prisma.entity.findMany({
      where,
      orderBy: { nameBs: "asc" },
      take: 250,
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

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 md:px-6 md:pt-12">
        <header className="border-b border-[color:var(--line)] pb-10">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-cream md:text-4xl">Entities</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-cream/75">
            Browse tracked persons, organizations, and events with citations, decisions, and graph relations.
          </p>
        </header>

        <form className="mt-8 flex flex-col gap-4 md:flex-row md:items-end" method="get" action="/entitet/">
          <label className="block flex-1 text-sm text-cream/80">
            Search
            <input
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Name…"
              className="mt-2 w-full rounded-lg border border-[color:var(--line)] bg-bg2 px-4 py-2.5 font-sans text-cream placeholder:text-muted"
            />
          </label>
          <label className="block w-full text-sm text-cream/80 md:w-52">
            Type
            <select
              name="type"
              defaultValue={type ?? ""}
              className="mt-2 w-full rounded-lg border border-[color:var(--line)] bg-bg2 px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-cream"
            >
              <option value="">All types</option>
              {typeRows.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.type}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-lg border-2 border-gold bg-transparent px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-gold hover:bg-gold/10"
          >
            Apply
          </button>
        </form>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-muted">
          Showing {rows.length} entr{rows.length === 1 ? "y" : "ies"}
        </p>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {rows.map((r) => (
            <li key={r.slug}>
              <EntityCard
                e={{
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
                }}
              />
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
