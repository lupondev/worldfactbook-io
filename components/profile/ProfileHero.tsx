import type { Country } from "@prisma/client";

import { formatInt } from "@/lib/format";

export function ProfileHero({ country }: { country: Country }) {
  const areaStr = country.area != null ? `${formatInt(country.area)} km²` : "—";
  const capitalStr = country.capital ?? "—";

  return (
    <header className="border-t-2 border-gold bg-bg2">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          <span className="text-[64px] leading-none" aria-hidden>
            {country.flag}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[48px] font-semibold leading-tight tracking-tight text-cream">
              {country.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-[color:var(--line)] bg-bg3/80 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-cream/90">
                {country.region}
              </span>
              <span className="text-sm text-cream/90">
                <span className="text-muted">Capital:</span>{" "}
                <span className="font-sans text-cream">{capitalStr}</span>
              </span>
              <span className="text-sm text-cream/90">
                <span className="text-muted">Area:</span>{" "}
                <span className="font-mono text-gold">{areaStr}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
