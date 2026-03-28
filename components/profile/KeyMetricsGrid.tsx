import type { Country } from "@prisma/client";

import { formatBillions, formatInt } from "@/lib/format";

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border-[0.5px] border-[color:var(--line)] bg-bg3 px-4 py-3">
      <p className="font-mono text-sm font-bold text-gold">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}

export function KeyMetricsGrid({ country }: { country: Country }) {
  const items = [
    { label: "GDP", value: formatBillions(country.gdp) },
    {
      label: "GDP per capita",
      value: country.gdpPerCapita != null ? `$${formatInt(country.gdpPerCapita)}` : "—",
    },
    { label: "Population", value: formatInt(country.population) },
    { label: "Area", value: country.area != null ? `${formatInt(country.area)} km²` : "—" },
    { label: "HDI rank", value: country.hdiRank != null ? String(country.hdiRank) : "—" },
    { label: "Democracy score", value: country.democracyScore != null ? String(country.democracyScore) : "—" },
    { label: "Life expectancy", value: country.lifeExpectancy != null ? String(country.lifeExpectancy) : "—" },
    { label: "Inflation", value: country.inflation != null ? `${country.inflation}%` : "—" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((m) => (
        <MetricCard key={m.label} label={m.label} value={m.value} />
      ))}
    </div>
  );
}
