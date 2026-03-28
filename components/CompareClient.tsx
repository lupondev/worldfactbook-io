"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { formatBillions, formatInt } from "@/lib/format";

export type CompareCountryRow = {
  slug: string;
  name: string;
  flag: string;
  gdp: number | null;
  gdpPerCapita: number | null;
  population: string | null;
  area: number | null;
  hdiRank: number | null;
  democracyScore: number | null;
  lifeExpectancy: number | null;
  inflation: number | null;
  publicDebt: number | null;
  literacyRate: number | null;
};

type RowDef = {
  key: string;
  label: string;
  prefer: "max" | "min";
  numeric: (c: CompareCountryRow) => number | null;
  format: (c: CompareCountryRow) => string;
};

const ROWS: RowDef[] = [
  {
    key: "gdp",
    label: "GDP",
    prefer: "max",
    numeric: (c) => c.gdp,
    format: (c) => formatBillions(c.gdp),
  },
  {
    key: "gdpPerCapita",
    label: "GDP per capita",
    prefer: "max",
    numeric: (c) => c.gdpPerCapita,
    format: (c) => (c.gdpPerCapita != null ? `$${formatInt(c.gdpPerCapita)}` : "—"),
  },
  {
    key: "population",
    label: "Population",
    prefer: "max",
    numeric: (c) => (c.population != null ? Number(c.population) : null),
    format: (c) => formatInt(c.population),
  },
  {
    key: "area",
    label: "Area",
    prefer: "max",
    numeric: (c) => c.area,
    format: (c) => (c.area != null ? `${formatInt(c.area)} km²` : "—"),
  },
  {
    key: "hdiRank",
    label: "HDI rank",
    prefer: "min",
    numeric: (c) => c.hdiRank,
    format: (c) => (c.hdiRank != null ? String(c.hdiRank) : "—"),
  },
  {
    key: "democracy",
    label: "Democracy score",
    prefer: "max",
    numeric: (c) => c.democracyScore,
    format: (c) => (c.democracyScore != null ? String(c.democracyScore) : "—"),
  },
  {
    key: "lifeExpectancy",
    label: "Life expectancy",
    prefer: "max",
    numeric: (c) => c.lifeExpectancy,
    format: (c) => (c.lifeExpectancy != null ? String(c.lifeExpectancy) : "—"),
  },
  {
    key: "inflation",
    label: "Inflation",
    prefer: "min",
    numeric: (c) => c.inflation,
    format: (c) => (c.inflation != null ? `${c.inflation}%` : "—"),
  },
  {
    key: "publicDebt",
    label: "Public debt",
    prefer: "min",
    numeric: (c) => c.publicDebt,
    format: (c) => (c.publicDebt != null ? `${c.publicDebt}%` : "—"),
  },
  {
    key: "literacy",
    label: "Literacy rate",
    prefer: "max",
    numeric: (c) => c.literacyRate,
    format: (c) => (c.literacyRate != null ? `${c.literacyRate}%` : "—"),
  },
];

function bestIndices(values: (number | null)[], prefer: "max" | "min"): Set<number> {
  const valid = values.map((v, i) => ({ v, i })).filter((x): x is { v: number; i: number } => x.v != null && !Number.isNaN(x.v));
  if (!valid.length) return new Set();
  if (prefer === "max") {
    const m = Math.max(...valid.map((x) => x.v));
    return new Set(valid.filter((x) => x.v === m).map((x) => x.i));
  }
  const m = Math.min(...valid.map((x) => x.v));
  return new Set(valid.filter((x) => x.v === m).map((x) => x.i));
}

function SlotPicker({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (slug: string) => void;
  options: { slug: string; name: string; flag: string }[];
  label: string;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter((o) => o.name.toLowerCase().includes(s) || o.slug.includes(s));
  }, [options, q]);
  const selected = options.find((o) => o.slug === value);

  return (
    <div className="relative space-y-2">
      <span className="font-mono text-[10px] uppercase tracking-wide text-muted">{label}</span>
      <input
        type="text"
        value={open ? q : selected ? `${selected.flag} ${selected.name}` : ""}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          setQ((prev) => prev || selected?.name || "");
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search country…"
        className="w-full rounded border-[0.5px] border-[color:var(--line)] bg-bg3 px-3 py-2 text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none"
      />
      {open ? (
        <ul className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded border-[0.5px] border-[color:var(--line)] bg-bg2 py-1 shadow-lg">
          {filtered.slice(0, 80).map((o) => (
            <li key={o.slug}>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-cream hover:bg-bg3"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(o.slug);
                  setQ("");
                  setOpen(false);
                }}
              >
                <span>{o.flag}</span>
                <span>{o.name}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function CompareClient({
  countries,
  initialSlugs,
}: {
  countries: CompareCountryRow[];
  initialSlugs: string[];
}) {
  const opt = useMemo(
    () => countries.map((c) => ({ slug: c.slug, name: c.name, flag: c.flag })),
    [countries],
  );
  const bySlug = useMemo(() => new Map(countries.map((c) => [c.slug, c])), [countries]);

  const [draftSlugs, setDraftSlugs] = useState<string[]>(() => initialSlugs.slice(0, 4));

  const resolvedRows = useMemo(() => {
    const seen = new Set<string>();
    const out: CompareCountryRow[] = [];
    for (const s of draftSlugs) {
      const row = bySlug.get(s);
      if (!row || seen.has(s)) continue;
      seen.add(s);
      out.push(row);
    }
    return out;
  }, [draftSlugs, bySlug]);

  const setSlot = useCallback((index: number, slug: string) => {
    setDraftSlugs((prev) => {
      const next = [...prev];
      next[index] = slug;
      return next;
    });
  }, []);

  const addSlot = () => {
    if (draftSlugs.length >= 4) return;
    const used = new Set(draftSlugs);
    const next = countries.find((c) => !used.has(c.slug));
    if (next) setDraftSlugs((s) => [...s, next.slug]);
  };

  const removeSlot = (index: number) => {
    if (draftSlugs.length <= 2) return;
    setDraftSlugs((s) => s.filter((_, i) => i !== index));
  };

  const runCompare = () => {
    setDraftSlugs((prev) => {
      const next: string[] = [];
      const seen = new Set<string>();
      for (const s of prev) {
        if (!bySlug.has(s) || seen.has(s)) continue;
        seen.add(s);
        next.push(s);
      }
      return next.length >= 2 ? next.slice(0, 4) : prev;
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {draftSlugs.map((slug, i) => (
          <div key={`${i}-${slug}`} className="relative rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg2/80 p-4">
            {draftSlugs.length > 2 ? (
              <button
                type="button"
                onClick={() => removeSlot(i)}
                className="absolute right-2 top-2 font-mono text-xs text-muted hover:text-gold"
                aria-label="Remove country"
              >
                × Remove
              </button>
            ) : null}
            <SlotPicker label={`Country ${i + 1}`} value={slug} onChange={(s) => setSlot(i, s)} options={opt} />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={runCompare}
          className="rounded bg-gold px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-bg"
        >
          Compare
        </button>
        {draftSlugs.length < 4 ? (
          <button
            type="button"
            onClick={addSlot}
            className="rounded border border-gold/50 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-gold hover:bg-gold/10"
          >
            + Add country
          </button>
        ) : null}
      </div>

      {resolvedRows.length < 2 ? (
        <p className="text-sm text-muted">Select at least two valid countries and press Compare.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg2">
          <table
            className="w-full border-collapse text-sm"
            style={{ minWidth: Math.max(480, 100 + resolvedRows.length * 148) }}
          >
            <thead>
              <tr className="border-b border-[color:var(--line)] bg-bg3">
                <th className="px-3 py-3 text-left font-mono text-[9px] uppercase tracking-widest text-muted">Metric</th>
                {resolvedRows.map((c, i) => (
                  <th key={`${c.slug}-${i}`} className="min-w-[132px] whitespace-nowrap px-3 py-3 text-left">
                    <Link href={`/countries/${c.slug}/`} className="font-display text-base text-cream hover:text-gold">
                      {c.flag} {c.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const nums = resolvedRows.map((c) => row.numeric(c));
                const winners = bestIndices(nums, row.prefer);
                const barMax = Math.max(...nums.map((n) => (n != null ? Math.abs(n) : 0)), 1);
                return (
                  <tr key={row.key} className="border-b border-[0.5px] border-[color:var(--line)]">
                    <th className="px-3 py-3 text-left font-mono text-[10px] uppercase tracking-wide text-muted">
                      {row.label}
                    </th>
                    {resolvedRows.map((c, colIdx) => {
                      const n = nums[colIdx];
                      const pct = n != null ? (Math.abs(n) / barMax) * 100 : 0;
                      const isBest = winners.has(colIdx);
                      return (
                        <td
                          key={`${c.slug}-${colIdx}`}
                          className={`min-w-[132px] px-3 py-3 align-top ${isBest ? "rounded-sm ring-1 ring-gold ring-offset-2 ring-offset-bg2" : ""}`}
                        >
                          <div className="font-mono text-sm text-cream">{row.format(c)}</div>
                          <div className="mt-2 h-1 w-full max-w-[120px] overflow-hidden rounded-full bg-bg">
                            <div
                              className="h-1 rounded-full bg-gold/60"
                              style={{ width: `${Math.min(100, pct)}%`, opacity: 0.6 }}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
