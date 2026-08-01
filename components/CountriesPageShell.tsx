"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { CountriesGridClient, type CountryCardRow } from "@/components/CountriesGridClient";

export type CountryPageRow = CountryCardRow & { hasAiSummary: boolean };

export function CountriesPageShell({ countries }: { countries: CountryPageRow[] }) {
  const searchParams = useSearchParams();
  const aiOnly = searchParams.get("ai") === "1" || searchParams.get("ai") === "true";

  const list = useMemo(
    () => (aiOnly ? countries.filter((c) => c.hasAiSummary) : countries),
    [aiOnly, countries],
  );

  return (
    <>
      <header className="mb-10 border-b border-[0.5px] border-[color:var(--line)] pb-8">
        <h1 className="font-display text-[36px] font-semibold text-cream">Countries</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          {aiOnly
            ? "Countries with an AI intelligence summary available. Use the main Countries link to see the full directory."
            : "Full grid of all entities in the database — same cards as the homepage feature strip, with region tabs and sorting."}
        </p>
      </header>
      <CountriesGridClient countries={list} />
    </>
  );
}
