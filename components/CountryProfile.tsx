import Link from "next/link";

import type { Country } from "@prisma/client";

import { Collapsible } from "@/components/Collapsible";
import { FactJson } from "@/components/FactJson";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { formatBillions, formatDaysAgo, formatInt } from "@/lib/format";
import { SITE_URL } from "@/lib/site";

export type CountryFocus =
  | "main"
  | "geography"
  | "economy"
  | "government"
  | "people"
  | "military";

const NAV = [
  { id: "main" as const, label: "Overview", href: (s: string) => `/countries/${s}/` },
  { id: "geography" as const, label: "Geography", href: (s: string) => `/countries/${s}/geography/` },
  { id: "people" as const, label: "People & Society", href: (s: string) => `/countries/${s}/people-and-society/` },
  { id: "economy" as const, label: "Economy", href: (s: string) => `/countries/${s}/economy/` },
  { id: "government" as const, label: "Government", href: (s: string) => `/countries/${s}/government/` },
  { id: "military" as const, label: "Military", href: (s: string) => `/countries/${s}/military/` },
];

export function CountryProfile({ country, focus = "main" }: { country: Country; focus?: CountryFocus }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Country",
    name: country.name,
    description: country.introduction?.slice(0, 500) || `${country.name} — World Factbook profile.`,
    url: `${SITE_URL}/countries/${country.slug}/`,
    identifier: [country.iso2, country.iso3, country.ciaCode].filter(Boolean),
  };

  const isMain = focus === "main";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <header className="border-b border-bg4 pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">World Factbook</p>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <span className="text-6xl leading-none" aria-hidden>
              {country.flag}
            </span>
            <div>
              <h1 className="font-display text-4xl text-cream md:text-5xl">{country.name}</h1>
              {country.officialName ? (
                <p className="mt-2 text-sm text-muted">{country.officialName}</p>
              ) : null}
            </div>
          </div>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Capital", country.capital],
              ["Region", country.region],
              ["Area (sq km)", country.area != null ? formatInt(country.area) : "—"],
              ["Population", formatInt(country.population)],
              ["GDP (USD bn)", formatBillions(country.gdp)],
              ["GDP per capita", country.gdpPerCapita != null ? `$${formatInt(country.gdpPerCapita)}` : "—"],
              ["GDP growth %", country.gdpGrowth ?? "—"],
              ["Inflation %", country.inflation ?? "—"],
              ["Unemployment %", country.unemployment ?? "—"],
              ["HDI rank", country.hdiRank ?? "—"],
              ["HDI score", country.hdiScore ?? "—"],
              ["Democracy (0–100)", country.democracyScore ?? "—"],
              ["Corruption index", country.corruptionIndex ?? "—"],
              ["Public debt % GDP", country.publicDebt ?? "—"],
              ["Life expectancy", country.lifeExpectancy ?? "—"],
              ["Literacy %", country.literacyRate ?? "—"],
            ].map(([k, v]) => (
              <div key={String(k)} className="rounded-lg border border-bg4 bg-bg2/50 px-3 py-2">
                <dt className="font-mono text-[10px] uppercase tracking-wide text-muted">{k}</dt>
                <dd className="font-mono text-sm text-gold2">{String(v)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 font-mono text-xs text-muted">
            Last updated: {country.dataUpdatedAt.toISOString().slice(0, 10)} ({formatDaysAgo(country.dataUpdatedAt)})
          </p>
        </header>

        <nav className="mb-8 flex flex-wrap gap-2 border-b border-bg4 pb-4 font-mono text-[11px] uppercase tracking-wide">
          {NAV.map((item) => {
            const active = item.id === focus;
            return (
              <Link
                key={item.id}
                href={item.href(country.slug)}
                className={`rounded-full border px-3 py-1 transition-colors ${
                  active ? "border-gold text-gold" : "border-bg4 text-muted hover:border-gold/50 hover:text-cream"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4 pb-16">
          {isMain ? (
            <Collapsible title="Introduction" defaultOpen>
              <p className="leading-relaxed text-cream/90">
                {country.introduction || "No introduction available for this entity."}
              </p>
            </Collapsible>
          ) : null}

          {(isMain || focus === "geography") && country.geography ? (
            <Collapsible title="Geography" defaultOpen={focus === "geography"}>
              <FactJson value={country.geography} />
            </Collapsible>
          ) : null}

          {(isMain || focus === "people") && country.peopleAndSociety ? (
            <Collapsible title="People and Society" defaultOpen={focus === "people"}>
              <FactJson value={country.peopleAndSociety} />
            </Collapsible>
          ) : null}

          {(isMain || focus === "economy") && country.economy ? (
            <Collapsible title="Economy" defaultOpen={focus === "economy"}>
              <FactJson value={country.economy} />
            </Collapsible>
          ) : null}

          {isMain && country.energy ? (
            <Collapsible title="Energy" defaultOpen={false}>
              <FactJson value={country.energy} />
            </Collapsible>
          ) : null}

          {isMain && country.communications ? (
            <Collapsible title="Communications" defaultOpen={false}>
              <FactJson value={country.communications} />
            </Collapsible>
          ) : null}

          {isMain && country.transportation ? (
            <Collapsible title="Transportation" defaultOpen={false}>
              <FactJson value={country.transportation} />
            </Collapsible>
          ) : null}

          {(isMain || focus === "government") && country.government ? (
            <Collapsible title="Government" defaultOpen={focus === "government"}>
              <FactJson value={country.government} />
            </Collapsible>
          ) : null}

          {(isMain || focus === "military") && country.military ? (
            <Collapsible title="Military" defaultOpen={focus === "military"}>
              <FactJson value={country.military} />
            </Collapsible>
          ) : null}

          {!isMain && focus === "geography" && !country.geography ? (
            <p className="text-muted">No geography section stored for this entity.</p>
          ) : null}
          {!isMain && focus === "people" && !country.peopleAndSociety ? (
            <p className="text-muted">No people & society section stored for this entity.</p>
          ) : null}
          {!isMain && focus === "economy" && !country.economy ? (
            <p className="text-muted">No economy section stored for this entity.</p>
          ) : null}
          {!isMain && focus === "government" && !country.government ? (
            <p className="text-muted">No government section stored for this entity.</p>
          ) : null}
          {!isMain && focus === "military" && !country.military ? (
            <p className="text-muted">No military section stored for this entity.</p>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
