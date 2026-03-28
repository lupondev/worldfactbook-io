"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";

import type { CountryPublic } from "@/lib/country-public";
import { formatBillions, formatInt } from "@/lib/format";

type Opt = { slug: string; name: string; flag: string };

export function CompareClient({
  options,
  initialA,
  initialB,
  left,
  right,
}: {
  options: Opt[];
  initialA: string;
  initialB: string;
  left: CountryPublic | null;
  right: CountryPublic | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const rows = useMemo(
    () => [
      { k: "Capital", l: left?.capital, r: right?.capital },
      { k: "Region", l: left?.region, r: right?.region },
      { k: "Population", l: formatInt(left?.population), r: formatInt(right?.population) },
      { k: "GDP (USD bn)", l: formatBillions(left?.gdp), r: formatBillions(right?.gdp) },
      { k: "GDP / capita", l: left?.gdpPerCapita != null ? `$${formatInt(left.gdpPerCapita)}` : "—", r: right?.gdpPerCapita != null ? `$${formatInt(right.gdpPerCapita)}` : "—" },
      { k: "HDI", l: left?.hdiScore ?? "—", r: right?.hdiScore ?? "—" },
      { k: "Democracy", l: left?.democracyScore ?? "—", r: right?.democracyScore ?? "—" },
      { k: "Corruption", l: left?.corruptionIndex ?? "—", r: right?.corruptionIndex ?? "—" },
    ],
    [left, right],
  );

  function onChange(which: "a" | "b", slug: string) {
    const a = which === "a" ? slug : initialA;
    const b = which === "b" ? slug : initialB;
    startTransition(() => {
      router.push(`/compare/?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`);
    });
  }

  return (
    <div className={`space-y-6 ${pending ? "opacity-60" : ""}`}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-muted">Country A</span>
          <select
            className="w-full rounded border border-bg4 bg-bg3 px-3 py-2 text-cream"
            value={initialA}
            onChange={(e) => onChange("a", e.target.value)}
          >
            {options.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.flag} {o.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-muted">Country B</span>
          <select
            className="w-full rounded border border-bg4 bg-bg3 px-3 py-2 text-cream"
            value={initialB}
            onChange={(e) => onChange("b", e.target.value)}
          >
            {options.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.flag} {o.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!left || !right ? (
        <p className="text-muted">One or both countries were not found. Choose another pair.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-bg4">
          <div className="grid grid-cols-2 border-b border-bg4 bg-bg3/60">
            <Link href={`/countries/${left.slug}/`} className="p-4 font-display text-xl text-cream hover:text-gold">
              {left.flag} {left.name}
            </Link>
            <Link href={`/countries/${right.slug}/`} className="p-4 font-display text-xl text-cream hover:text-gold">
              {right.flag} {right.name}
            </Link>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {rows.map((row) => (
                <tr key={row.k} className="border-b border-bg4/70">
                  <th className="w-1/3 p-3 text-left font-mono text-[10px] uppercase tracking-wide text-muted">
                    {row.k}
                  </th>
                  <td className="w-1/3 p-3 font-mono text-gold2">{String(row.l)}</td>
                  <td className="w-1/3 p-3 font-mono text-cream">{String(row.r)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
