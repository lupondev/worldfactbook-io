"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export type PublicDecision = {
  id?: string;
  slug?: string;
  titleBs?: string;
  summaryBs?: string[];
  whyShouldICare?: { gradjanin?: string };
  decisionType?: string;
  impactScore?: number;
  publishedAt?: string;
};

function impactLabel(score: number) {
  if (score >= 9) return { text: `${score}/10 KRITIČNO`, cls: "bg-red-700/90 text-red-100" };
  if (score >= 8) return { text: `${score}/10 VAŽNO`, cls: "bg-orange-700/90 text-orange-100" };
  return { text: `${score}/10 BITNO`, cls: "bg-yellow-700/90 text-yellow-100" };
}

function dateBs(value?: string) {
  if (!value) return "Nepoznat datum";
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "Nepoznat datum";
  return `${d.toLocaleDateString("bs-BA", { day: "numeric", month: "long", year: "numeric" })}.`;
}

export function OdlukeListing({ items }: { items: PublicDecision[] }) {
  const searchParams = useSearchParams();
  const impactParam = searchParams.get("impact");
  const minImpact =
    impactParam === "9" || impactParam === "8" || impactParam === "7" ? Number(impactParam) : 7;

  const filtered = useMemo(() => {
    if (minImpact >= 9) return items.filter((d) => (d.impactScore || 0) >= 9);
    if (minImpact >= 8) return items.filter((d) => (d.impactScore || 0) >= 8);
    return items;
  }, [items, minImpact]);

  const hero = filtered.find((d) => (d.impactScore || 0) >= 9) || filtered[0] || null;
  const rest = hero ? filtered.filter((d) => (d.slug || d.id) !== (hero.slug || hero.id)) : filtered;

  return (
    <>
      <h1 className="font-display text-4xl text-cream">Odluke koje mijenjaju BiH</h1>
      <p className="mt-2 text-sm text-muted">AI analizira, građanin razumije. OHR odluke s impact scoreom.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { id: "all", label: "Sve" },
          { id: "9", label: "Impact 9 (kritično)" },
          { id: "8", label: "Impact 8 (narandžasto)" },
          { id: "7", label: "Impact 7 (žuto)" },
        ].map((f) => (
          <Link
            key={f.id}
            href={f.id === "all" ? "/odluke/" : `/odluke/?impact=${f.id}`}
            className={`rounded border px-3 py-1.5 font-mono text-xs ${
              (f.id === "all" && !impactParam) || minImpact === Number(f.id) ? "border-gold text-gold" : "border-bg4 text-muted"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {hero ? (
        <article className="mt-6 rounded-xl border border-bg4 bg-bg2/70 p-6">
          <span className={`inline-flex rounded px-2 py-1 font-mono text-[11px] font-bold ${impactLabel(hero.impactScore || 7).cls}`}>
            {impactLabel(hero.impactScore || 7).text}
          </span>
          <p className="mt-3 inline-flex rounded border border-bg4 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-muted">
            {hero.decisionType || "Decision"}
          </p>
          <h2 className="mt-3 font-display text-3xl text-cream">{hero.titleBs || "OHR odluka"}</h2>
          <p className="mt-2 text-sm text-muted">{(hero.summaryBs?.[0] || "").slice(0, 200)}</p>
          <p className="mt-3 text-sm text-cream/90">
            <span className="font-semibold">Šta to znači za građanina:</span> {(hero.whyShouldICare?.gradjanin || "").slice(0, 120)}
          </p>
          <p className="mt-3 font-mono text-xs text-muted">{dateBs(hero.publishedAt)}</p>
          <Link href={`/odluke/${hero.slug || hero.id || ""}`} className="mt-4 inline-block font-mono text-xs font-bold uppercase tracking-wide text-gold hover:underline">
            Pročitaj odluku →
          </Link>
        </article>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {rest.slice(0, 21).map((d) => (
          <article key={d.slug || d.id} className="rounded-lg border border-bg4 bg-bg2/70 p-5">
            <span className={`inline-flex rounded px-2 py-1 font-mono text-[11px] font-bold ${impactLabel(d.impactScore || 7).cls}`}>
              {impactLabel(d.impactScore || 7).text}
            </span>
            <p className="mt-3 inline-flex rounded border border-bg4 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-muted">
              {d.decisionType || "Decision"}
            </p>
            <h3 className="mt-2 font-display text-2xl text-cream">{d.titleBs || "OHR odluka"}</h3>
            <p className="mt-2 text-sm text-muted">{(d.summaryBs?.[0] || "").slice(0, 200)}</p>
            <p className="mt-3 text-sm text-cream/90">
              <span className="font-semibold">Šta to znači za građanina:</span> {(d.whyShouldICare?.gradjanin || "").slice(0, 120)}
            </p>
            <p className="mt-3 font-mono text-xs text-muted">{dateBs(d.publishedAt)}</p>
            <Link href={`/odluke/${d.slug || d.id || ""}`} className="mt-4 inline-block font-mono text-xs font-bold uppercase tracking-wide text-gold hover:underline">
              Pročitaj odluku →
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
