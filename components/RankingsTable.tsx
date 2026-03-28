"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { formatBillions, formatInt } from "@/lib/format";

type Row = {
  id: string;
  name: string;
  slug: string;
  flag: string;
  region: string;
  gdp: number | null;
  gdpPerCapita: number | null;
  population: string | null;
  hdiScore: number | null;
  democracyScore: number | null;
  corruptionIndex: number | null;
};

type SortKey = keyof Pick<
  Row,
  "gdp" | "gdpPerCapita" | "population" | "hdiScore" | "democracyScore" | "corruptionIndex" | "name"
>;

export function RankingsTable({ countries }: { countries: Row[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("population");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const mul = dir === "asc" ? 1 : -1;
    const arr = [...countries];
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (sortKey === "name") {
        return mul * String(av).localeCompare(String(bv));
      }
      const an = av == null ? -Infinity : Number(av);
      const bn = bv == null ? -Infinity : Number(bv);
      if (an === bn) return a.name.localeCompare(b.name);
      return mul * (an < bn ? -1 : 1);
    });
    return arr;
  }, [countries, sortKey, dir]);

  function toggle(k: SortKey) {
    if (k === sortKey) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setDir(k === "name" ? "asc" : "desc");
    }
  }

  const th = (k: SortKey, label: string) => (
    <th className="p-3 text-left">
      <button
        type="button"
        onClick={() => toggle(k)}
        className="font-mono text-[10px] uppercase tracking-wide text-gold hover:text-gold2"
      >
        {label}
        {sortKey === k ? (dir === "asc" ? " ↑" : " ↓") : ""}
      </button>
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-bg4 bg-bg2/60">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="border-b border-bg4 bg-bg3/50">
          <tr className="text-muted">
            <th className="p-3 text-left font-mono text-[10px] uppercase tracking-wide">Country</th>
            {th("gdp", "GDP (bn)")}
            {th("gdpPerCapita", "GDP/cap")}
            {th("population", "Population")}
            {th("hdiScore", "HDI")}
            {th("democracyScore", "Democracy")}
            {th("corruptionIndex", "Corruption")}
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => (
            <tr key={c.id} className="border-b border-bg4/60 hover:bg-bg3/30">
              <td className="p-3">
                <Link href={`/countries/${c.slug}/`} className="flex items-center gap-2 text-cream hover:text-gold">
                  <span className="text-xl">{c.flag}</span>
                  <span className="font-display">{c.name}</span>
                  <span className="font-mono text-[10px] text-muted">{c.region}</span>
                </Link>
              </td>
              <td className="p-3 font-mono text-gold2">{formatBillions(c.gdp)}</td>
              <td className="p-3 font-mono text-cream">{c.gdpPerCapita != null ? `$${formatInt(c.gdpPerCapita)}` : "—"}</td>
              <td className="p-3 font-mono text-cream">{formatInt(c.population)}</td>
              <td className="p-3 font-mono text-cream">{c.hdiScore ?? "—"}</td>
              <td className="p-3 font-mono text-cream">{c.democracyScore ?? "—"}</td>
              <td className="p-3 font-mono text-cream">{c.corruptionIndex ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
