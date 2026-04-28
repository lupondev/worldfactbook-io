"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { BlogMarkdown } from "@/components/BlogMarkdown";
import type { SerializedEntityPublic } from "@/lib/entities-public";
import { buildEntityTimeline } from "@/lib/entity-timeline";

import { EntityTimeline } from "./EntityTimeline";
import { RelationsList, type RelationRow } from "./RelationsList";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "decisions", label: "Decisions" },
  { id: "news", label: "News" },
  { id: "relations", label: "Relations" },
  { id: "history", label: "History" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function formatActiveFrom(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export function EntityProfileClient({ entity }: { entity: SerializedEntityPublic }) {
  const searchParams = useSearchParams();
  const rawTab = (searchParams.get("tab") ?? "overview").toLowerCase();
  const tab = (TABS.some((t) => t.id === rawTab) ? rawTab : "overview") as TabId;
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const timelineAll = useMemo(() => buildEntityTimeline(entity), [entity]);
  const timelineMini = useMemo(() => buildEntityTimeline(entity, 5), [entity]);

  const subjectTop = useMemo(
    () => entity.decisions.filter((d) => d.role === "subject").slice(0, 3),
    [entity.decisions],
  );
  const newsTop = useMemo(() => entity.articles.slice(0, 3), [entity.articles]);

  const decisionsFiltered = useMemo(() => {
    if (roleFilter === "all") return entity.decisions;
    return entity.decisions.filter((d) => d.role === roleFilter);
  }, [entity.decisions, roleFilter]);

  const img = entity.imageUrl || entity.avatar;
  const incoming = entity.relations.incoming as RelationRow[];
  const outgoing = entity.relations.outgoing as RelationRow[];

  return (
    <>
      <header className="border-t-2 border-gold bg-gradient-to-b from-bg2 to-bg/95">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-[color:var(--line)] bg-bg3 shadow-lg shadow-black/30 md:mx-0 md:h-36 md:w-36">
              {img ? (
                <Image src={img} alt={entity.nameBs} fill className="object-cover" sizes="144px" priority unoptimized />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-4xl text-gold/80">
                  {entity.nameBs.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 text-center md:text-left">
              <h1 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-tight tracking-tight text-cream">
                {entity.nameBs}
              </h1>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-gold/90">
                {entity.type}
                {entity.role ? <> · {entity.role}</> : null}
              </p>
              {entity.shortBio ? (
                <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-cream/85 md:mx-0">{entity.shortBio}</p>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="border-y border-[color:var(--line)] bg-bg3/40">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-3 px-4 py-4 font-mono text-[12px] text-cream/90 md:justify-between md:px-6">
          <span>
            <span aria-hidden>📊 </span>
            {entity.counts.decisions} decisions on record
          </span>
          <span>
            <span aria-hidden>📰 </span>
            {entity.counts.articles} articles
          </span>
          <span>
            <span aria-hidden>🔗 </span>
            {entity.counts.relations} relations
          </span>
          <span>
            <span aria-hidden>📅 </span>
            Active since {formatActiveFrom(entity.activeFrom)}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 md:px-6 md:pt-10">
        <nav aria-label="Profile sections" className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:pb-4">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <Link
                key={t.id}
                href={`?tab=${t.id}`}
                scroll={false}
                className={`shrink-0 rounded-full border px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wide transition-colors ${
                  active
                    ? "border-gold bg-gold/15 text-gold2"
                    : "border-[color:var(--line)] bg-bg2/60 text-cream/80 hover:border-gold/40 hover:text-cream"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          {tab === "overview" ? (
            <div className="space-y-12">
              <section aria-labelledby="bio-heading">
                <h2 id="bio-heading" className="font-display text-xl font-semibold text-cream">
                  Bio
                </h2>
                {entity.shortBio ? <p className="mt-4 text-base leading-relaxed text-cream/85">{entity.shortBio}</p> : null}
                {entity.bioRich ? (
                  <div className="mt-6">
                    <BlogMarkdown content={entity.bioRich} />
                  </div>
                ) : null}
              </section>
              <section aria-labelledby="dec-preview">
                <h2 id="dec-preview" className="font-display text-xl font-semibold text-cream">
                  Recent decisions (as subject)
                </h2>
                <ul className="mt-4 space-y-3">
                  {subjectTop.length === 0 ? (
                    <li className="text-sm text-muted">No subject-role decisions yet.</li>
                  ) : (
                    subjectTop.map((d) => (
                      <li
                        key={d.id}
                        className="rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg2/60 px-4 py-3 text-sm text-cream/90"
                      >
                        <div className="font-medium text-cream">{d.title}</div>
                        <div className="mt-1 font-mono text-[10px] uppercase text-muted">
                          {formatActiveFrom(d.decidedAt)} · {d.role}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </section>
              <section aria-labelledby="news-preview">
                <h2 id="news-preview" className="font-display text-xl font-semibold text-cream">
                  Related news
                </h2>
                <ul className="mt-4 space-y-3">
                  {newsTop.length === 0 ? (
                    <li className="text-sm text-muted">No linked articles yet.</li>
                  ) : (
                    newsTop.map((a) => (
                      <li key={a.id} className="text-sm">
                        {a.url ? (
                          <a href={a.url} className="text-gold hover:text-gold2">
                            {a.title}
                          </a>
                        ) : (
                          <span className="text-cream/90">{a.title}</span>
                        )}
                        {a.publishedAt ? (
                          <span className="ml-2 font-mono text-[10px] text-muted">{formatActiveFrom(a.publishedAt)}</span>
                        ) : null}
                      </li>
                    ))
                  )}
                </ul>
              </section>
              <section aria-labelledby="timeline-preview">
                <h2 id="timeline-preview" className="font-display text-xl font-semibold text-cream">
                  Latest activity
                </h2>
                <div className="mt-4 max-w-2xl">
                  <EntityTimeline events={timelineMini} dense />
                </div>
              </section>
            </div>
          ) : null}

          {tab === "decisions" ? (
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="text-sm text-cream/80">Filter by role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-lg border border-[color:var(--line)] bg-bg2 px-3 py-2 font-mono text-xs text-cream"
                >
                  <option value="all">All</option>
                  <option value="subject">Subject</option>
                  <option value="affected">Affected</option>
                  <option value="mentioned">Mentioned</option>
                </select>
              </div>
              <ul className="space-y-3">
                {decisionsFiltered.map((d) => (
                  <li
                    key={d.id}
                    className="rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg2/60 px-4 py-4 text-sm text-cream/90"
                  >
                    <div className="font-medium text-cream">{d.title}</div>
                    {d.summary ? <p className="mt-2 leading-relaxed text-cream/80">{d.summary}</p> : null}
                    <div className="mt-2 font-mono text-[10px] uppercase text-muted">
                      {formatActiveFrom(d.decidedAt)} · {d.role}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {tab === "news" ? (
            <ul className="space-y-4">
              {entity.articles.length === 0 ? (
                <li className="text-sm text-muted">No articles linked.</li>
              ) : (
                entity.articles.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg2/60 px-4 py-4 text-sm"
                  >
                    {a.url ? (
                      <a href={a.url} className="font-medium text-gold hover:text-gold2">
                        {a.title}
                      </a>
                    ) : (
                      <span className="font-medium text-cream">{a.title}</span>
                    )}
                    {a.publishedAt ? (
                      <div className="mt-2 font-mono text-[10px] uppercase text-muted">{formatActiveFrom(a.publishedAt)}</div>
                    ) : null}
                  </li>
                ))
              )}
            </ul>
          ) : null}

          {tab === "relations" ? <RelationsList currentSlug={entity.slug} incoming={incoming} outgoing={outgoing} /> : null}

          {tab === "history" ? (
            <div className="max-w-2xl">
              <EntityTimeline events={timelineAll} />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
