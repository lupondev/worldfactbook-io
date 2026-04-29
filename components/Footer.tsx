import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-bg4 bg-bg2 px-4 py-12 md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-xl text-cream">
            World<span className="text-gold">Factbook</span>.io
          </p>
          <p className="mt-2 max-w-md text-sm text-muted">
            Aggregated public-domain and open-license indicators. Profiles derived from the CIA World Factbook JSON corpus
            (factbook.json) and companion open datasets.
          </p>
        </div>
        <div className="text-sm text-muted">
          <p className="font-mono text-xs uppercase tracking-wider text-cream/70">Data sources</p>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            <li>World Bank</li>
            <li>IMF</li>
            <li>UN Data</li>
            <li>Freedom House</li>
            <li>REST Countries</li>
            <li>Our World in Data</li>
            <li>Transparency International</li>
            <li>UNDP HDI</li>
          </ul>
        </div>
        <div className="text-sm text-muted">
          <p className="font-mono text-xs uppercase tracking-wider text-cream/70">Pravo & edukacija</p>
          <ul className="mt-2 grid gap-1">
            <li>
              <Link className="text-gold hover:underline" href="/odluke/">
                OHR Odluke
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-center font-mono text-xs text-muted">
        FREE FOREVER · © 2026 ·{" "}
        <Link className="text-gold hover:underline" href="/sitemap.xml">
          Sitemap
        </Link>
      </p>
    </footer>
  );
}
