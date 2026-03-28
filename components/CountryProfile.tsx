import Link from "next/link";

import type { Country } from "@prisma/client";

import { Collapsible } from "@/components/Collapsible";
import { FactJson } from "@/components/FactJson";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { AiSummaryBlock } from "@/components/profile/AiSummaryBlock";
import { KeyMetricsGrid } from "@/components/profile/KeyMetricsGrid";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { formatDaysAgo } from "@/lib/format";

export type CountryFocus =
  | "main"
  | "geography"
  | "economy"
  | "government"
  | "people"
  | "military";

const SUB_NAV = [
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
    description: country.aiSummary || `${country.name} country profile on WorldFactbook.io.`,
  };

  if (focus === "main") {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Navbar />
        <main>
          <ProfileHero country={country} />

          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-8 md:flex-row md:px-6 md:pt-10">
            <ProfileSidebar slug={country.slug} dataUpdatedAt={country.dataUpdatedAt} />
            <div className="min-w-0 flex-1 space-y-6">
              <div id="introduction" className="scroll-mt-28 space-y-6">
                <AiSummaryBlock aiSummary={country.aiSummary} />
                <section id="metrics" aria-label="Key metrics">
                  <KeyMetricsGrid country={country} />
                </section>
              </div>

              {country.geography ? (
                <Collapsible id="geography" title="Geography" defaultOpen={false}>
                  <FactJson value={country.geography} />
                </Collapsible>
              ) : null}

              {country.economy ? (
                <Collapsible id="economy" title="Economy" defaultOpen={false}>
                  <FactJson value={country.economy} />
                </Collapsible>
              ) : null}

              {country.government ? (
                <Collapsible id="government" title="Government" defaultOpen={false}>
                  <FactJson value={country.government} />
                </Collapsible>
              ) : null}

              {country.peopleAndSociety ? (
                <Collapsible id="people" title="People & Society" defaultOpen={false}>
                  <FactJson value={country.peopleAndSociety} />
                </Collapsible>
              ) : null}

              {country.military ? (
                <Collapsible id="military" title="Military" defaultOpen={false}>
                  <FactJson value={country.military} />
                </Collapsible>
              ) : null}

              {country.energy ? (
                <Collapsible id="energy" title="Energy" defaultOpen={false}>
                  <FactJson value={country.energy} />
                </Collapsible>
              ) : null}
            </div>
          </div>

          <footer className="border-t border-[0.5px] border-[color:var(--line)] bg-bg2/40 py-6">
            <p className="text-center font-mono text-[10px] uppercase tracking-wider text-muted">
              Data: World Bank · IMF · UN · Freedom House | Updated weekly
            </p>
          </footer>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <header className="border-b border-[0.5px] border-[color:var(--line)] pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">World Factbook</p>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <span className="text-5xl leading-none" aria-hidden>
              {country.flag}
            </span>
            <div>
              <h1 className="font-display text-4xl text-cream md:text-5xl">{country.name}</h1>
              {country.officialName ? <p className="mt-2 text-sm text-muted">{country.officialName}</p> : null}
            </div>
          </div>
          <p className="mt-6 font-mono text-xs text-muted">
            Last updated: {country.dataUpdatedAt.toISOString().slice(0, 10)} ({formatDaysAgo(country.dataUpdatedAt)})
          </p>
        </header>

        <nav className="mb-8 flex flex-wrap gap-2 border-b border-bg4 pb-4 font-mono text-[11px] uppercase tracking-wide">
          {SUB_NAV.map((item) => {
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
          {focus === "geography" && country.geography ? (
            <Collapsible title="Geography" defaultOpen>
              <FactJson value={country.geography} />
            </Collapsible>
          ) : null}
          {focus === "people" && country.peopleAndSociety ? (
            <Collapsible title="People and Society" defaultOpen>
              <FactJson value={country.peopleAndSociety} />
            </Collapsible>
          ) : null}
          {focus === "economy" && country.economy ? (
            <Collapsible title="Economy" defaultOpen>
              <FactJson value={country.economy} />
            </Collapsible>
          ) : null}
          {focus === "government" && country.government ? (
            <Collapsible title="Government" defaultOpen>
              <FactJson value={country.government} />
            </Collapsible>
          ) : null}
          {focus === "military" && country.military ? (
            <Collapsible title="Military" defaultOpen>
              <FactJson value={country.military} />
            </Collapsible>
          ) : null}

          {focus === "geography" && !country.geography ? (
            <p className="text-muted">No geography section stored for this entity.</p>
          ) : null}
          {focus === "people" && !country.peopleAndSociety ? (
            <p className="text-muted">No people & society section stored for this entity.</p>
          ) : null}
          {focus === "economy" && !country.economy ? (
            <p className="text-muted">No economy section stored for this entity.</p>
          ) : null}
          {focus === "government" && !country.government ? (
            <p className="text-muted">No government section stored for this entity.</p>
          ) : null}
          {focus === "military" && !country.military ? (
            <p className="text-muted">No military section stored for this entity.</p>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
