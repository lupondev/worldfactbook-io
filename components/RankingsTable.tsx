"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { formatBillions, formatInt } from "@/lib/format";

export type RankingsRow = {
  id: string;
  name: string;
  slug: string;
  flag: string;
  region: string;
  gdp: number | null;
  gdpPerCapita: number | null;
  population: string | null;
  hdiRank: number | null;
  hdiScore: number | null;
  democracyScore: number | null;
  corruptionIndex: number | null;
};

type TabId = "gdp" | "gdpPerCapita" | "population" | "hdi" | "democracy" | "corruption";

const TABS: { id: TabId; label: string }[] = [
  { id: "gdp", label: "GDP" },
  { id: "gdpPerCapita", label: "GDP per capita" },
  { id: "population", label: "Population" },
  { id: "hdi", label: "HDI" },
  { id: "democracy", label: "Democracy" },
  { id: "corruption", label: "Corruption" },
];

function tabValue(c: RankingsRow, tab: TabId): number | null {
  switch (tab) {
    case "gdp":
      return c.gdp;
    case "gdpPerCapita":
      return c.gdpPerCapita;
    case "population":
      return c.population != null ? Number(c.population) : null;
    case "hdi":
      return c.hdiRank;
    case "democracy":
      return c.democracyScore;
    case "corruption":
      return c.corruptionIndex;
    default:
      return null;
  }
}

function formatCell(c: RankingsRow, tab: TabId): string {
  switch (tab) {
    case "gdp":
      return formatBillions(c.gdp);
    case "gdpPerCapita":
      return c.gdpPerCapita != null ? `$${formatInt(c.gdpPerCapita)}` : "—";
    case "population":
      return formatInt(c.population);
    case "hdi":
      if (c.hdiRank != null) return `#${c.hdiRank}`;
      return c.hdiScore != null ? String(c.hdiScore) : "—";
    case "democracy":
      return c.democracyScore != null ? String(c.democracyScore) : "—";
    case "corruption":
      return c.corruptionIndex != null ? String(c.corruptionIndex) : "—";
    default:
      return "—";
  }
}

export function RankingsTable({ countries }: { countries: RankingsRow[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("gdp");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(s));
  }, [countries, q]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const hdiAsc = tab === "hdi";
    arr.sort((a, b) => {
      const av = tabValue(a, tab);
      const bv = tabValue(b, tab);
      if (av == null && bv == null) return a.name.localeCompare(b.name);
      if (av == null) return 1;
      if (bv == null) return -1;
      if (hdiAsc) {
        if (av === bv) return a.name.localeCompare(b.name);
        return av < bv ? -1 : 1;
      }
      if (av === bv) return a.name.localeCompare(b.name);
      return av > bv ? -1 : 1;
    });
    return arr.map((c, i) => ({ c, rank: i + 1 }));
  }, [filtered, tab]);

  const maxVal = useMemo(() => {
    let m = 0;
    for (const { c } of sorted) {
      const v = tabValue(c, tab);
      if (v != null && Number.isFinite(v)) m = Math.max(m, Math.abs(v));
    }
    return m || 1;
  }, [sorted, tab]);

  function barWidthPct(v: number | null): number {
    if (v == null || !Number.isFinite(v) || maxVal <= 0) return 0;
    if (tab === "hdi") {
      const inv = 1 - (Math.abs(v) - 1) / maxVal;
      return Math.max(0, Math.min(100, inv * 100));
    }
    return Math.min(100, (Math.abs(v) / maxVal) * 100);
  }

  return (
    <div className="space-y-6">
      <div
        className="flex flex-wrap gap-1 border-b border-[0.5px] border-[color:var(--line)]"
        role="tablist"
        aria-label="Ranking metric"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-3 py-2 font-mono text-xs uppercase tracking-wide transition-colors ${
              tab === t.id
                ? "border-gold text-gold"
                : "border-transparent text-muted hover:text-cream"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter by country name…"
        className="w-full max-w-md rounded border-[0.5px] border-[color:var(--line)] bg-bg3 px-4 py-2.5 font-sans text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none"
      />

      <div className="overflow-x-auto rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg2">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="bg-bg3 text-left">
              <th className="px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-widest text-muted">#</th>
              <th className="px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-widest text-muted">Country</th>
              <th className="px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-widest text-muted">Value</th>
              <th className="w-32 min-w-[8rem] px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-widest text-muted">
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(({ c, rank }) => {
              const v = tabValue(c, tab);
              const pct = barWidthPct(v);
              return (
                <tr
                  key={c.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(`/countries/${c.slug}/`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/countries/${c.slug}/`);
                    }
                  }}
                  className="cursor-pointer border-b border-[0.5px] border-[color:var(--line)] transition-colors hover:bg-bg3"
                >
                  <td className="px-4 py-3 font-mono text-sm text-gold">{rank}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/countries/${c.slug}/`}
                      className="flex items-center gap-2 text-cream hover:text-gold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-xl leading-none">{c.flag}</span>
                      <span className="font-display text-base">{c.name}</span>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-middle font-mono text-sm text-cream">
                    {formatCell(c, tab)}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="h-1 w-full max-w-[140px] overflow-hidden rounded-full bg-bg">
                      <div
                        className="h-1 rounded-full bg-gold/60"
                        style={{ width: `${Math.min(100, pct)}%`, opacity: 0.6 }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
