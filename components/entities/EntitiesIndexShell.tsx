"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { EntityCard } from "@/components/entities/EntityCard";

export type EntityIndexRow = {
  slug: string;
  nameBs: string;
  type: string;
  role: string | null;
  shortBio: string | null;
  imageUrl: string | null;
  avatar: string | null;
  counts: {
    decisions: number;
    articles: number;
    relations: number;
  };
};

export function EntitiesIndexShell({
  rows,
  types,
}: {
  rows: EntityIndexRow[];
  types: string[];
}) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";
  const type = searchParams.get("type")?.trim() ?? "";

  const filtered = useMemo(() => {
    let list = rows;
    if (type) list = list.filter((r) => r.type === type);
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter((r) => r.nameBs.toLowerCase().includes(needle));
    }
    return list.slice(0, 250);
  }, [q, type, rows]);

  return (
    <>
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
            defaultValue={type}
            className="mt-2 w-full rounded-lg border border-[color:var(--line)] bg-bg2 px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-cream"
          >
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
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
        Showing {filtered.length} entr{filtered.length === 1 ? "y" : "ies"}
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.map((r) => (
          <li key={r.slug}>
            <EntityCard e={r} />
          </li>
        ))}
      </ul>
    </>
  );
}
