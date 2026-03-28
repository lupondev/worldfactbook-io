"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { formatBillions, formatDaysAgo, formatInt } from "@/lib/format";

export type CountryCardRow = {
  id: string;
  slug: string;
  name: string;
  flag: string;
  region: string;
  gdp: number | null;
  population: string | null;
  democracyScore: number | null;
  hdiScore: number | null;
  dataUpdatedAt: string;
};

const TABS = ["All", "Africa", "Europe", "Asia", "Americas", "Middle East", "Oceania"] as const;
type RegionTab = (typeof TABS)[number];

function matchesRegionTab(tab: RegionTab, region: string): boolean {
  const r = region.toLowerCase();
  if (tab === "All") return true;
  if (tab === "Africa") return r.includes("africa");
  if (tab === "Europe") return r.includes("europe");
  if (tab === "Middle East") return r.includes("middle east");
  if (tab === "Oceania")
    return r.includes("oceania") || r.includes("australia") || r === "oceans" || r.includes("australia-oceania");
  if (tab === "Asia") {
    if (r.includes("middle east")) return false;
    return r.includes("asia");
  }
  if (tab === "Americas") {
    return (
      r.includes("america") ||
      r.includes("caribbean") ||
      r.includes("central america") ||
      r.includes("south america") ||
      r.includes("north america")
    );
  }
  return true;
}

type SortMode = "name" | "gdp" | "population";

export function CountriesGridClient({ countries }: { countries: CountryCardRow[] }) {
  const [tab, setTab] = useState<RegionTab>("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortMode>("name");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return countries.filter((c) => matchesRegionTab(tab, c.region) && (!s || c.name.toLowerCase().includes(s)));
  }, [countries, tab, q]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "gdp") {
        const av = a.gdp ?? -Infinity;
        const bv = b.gdp ?? -Infinity;
        if (av === bv) return a.name.localeCompare(b.name);
        return bv - av;
      }
      const ap = a.population != null ? Number(a.population) : -Infinity;
      const bp = b.population != null ? Number(b.population) : -Infinity;
      if (ap === bp) return a.name.localeCompare(b.name);
      return bp - ap;
    });
    return arr;
  }, [filtered, sort]);

  return (
    <div className="space-y-8">
      <div
        className="flex flex-wrap gap-1 border-b border-[0.5px] border-[color:var(--line)]"
        role="tablist"
        aria-label="Region"
      >
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`border-b-2 px-3 py-2 font-mono text-[11px] uppercase tracking-wide transition-colors ${
              tab === t ? "border-gold text-gold" : "border-transparent text-muted hover:text-cream"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name…"
          className="w-full max-w-md rounded border-[0.5px] border-[color:var(--line)] bg-bg3 px-4 py-2.5 text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none"
        />
        <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wide text-muted">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="rounded border border-[color:var(--line)] bg-bg2 px-3 py-2 text-xs text-cream"
          >
            <option value="name">Alphabetical</option>
            <option value="gdp">GDP</option>
            <option value="population">Population</option>
          </select>
        </label>
      </div>

      <p className="font-mono text-xs text-muted">
        Showing {sorted.length} of {countries.length} countries
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((c) => (
          <Link
            key={c.id}
            href={`/countries/${c.slug}/`}
            className="group rounded-xl border border-bg4 bg-bg2/70 p-5 transition-colors hover:border-gold hover:shadow-[0_0_0_1px_rgba(232,168,60,0.35)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-3xl">{c.flag}</p>
                <h2 className="mt-2 font-display text-xl text-cream group-hover:text-gold">{c.name}</h2>
                <p className="text-sm text-muted">{c.region}</p>
              </div>
              <span className="live-dot mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-live" />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <dt className="text-muted">GDP</dt>
                <dd className="text-gold2">{formatBillions(c.gdp)}</dd>
              </div>
              <div>
                <dt className="text-muted">Population</dt>
                <dd className="text-cream">{formatInt(c.population)}</dd>
              </div>
              <div>
                <dt className="text-muted">Democracy</dt>
                <dd className="text-cream">{c.democracyScore ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted">HDI</dt>
                <dd className="text-cream">{c.hdiScore ?? "—"}</dd>
              </div>
            </dl>
            <p className="mt-4 text-[10px] font-mono uppercase tracking-wide text-live">
              Live · Updated {formatDaysAgo(new Date(c.dataUpdatedAt))}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
