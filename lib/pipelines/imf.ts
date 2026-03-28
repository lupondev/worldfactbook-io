import type { PrismaClient } from "@prisma/client";

type ImfSeries = Record<string, Record<string, number>>;

function latestActual(series: Record<string, number> | undefined, maxYear: number): number | null {
  if (!series) return null;
  const years = Object.keys(series)
    .map((y) => parseInt(y, 10))
    .filter((y) => Number.isFinite(y) && y <= maxYear);
  if (!years.length) return null;
  const y = Math.max(...years);
  const v = series[String(y)];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

async function fetchIndicatorMap(indicator: string): Promise<ImfSeries> {
  const url = `https://www.imf.org/external/datamapper/api/v1/${indicator}`;
  const res = await fetch(url);
  if (!res.ok) return {};
  const json = (await res.json()) as { values?: Record<string, Record<string, Record<string, number>>> };
  const block = json.values?.[indicator];
  return (block || {}) as ImfSeries;
}

/**
 * Pulls IMF WEO series for all ISO3 codes and updates matching countries.
 */
export async function syncAllImf(prisma: PrismaClient, maxYear = new Date().getFullYear()): Promise<string[]> {
  const [growth, ca, fiscal] = await Promise.all([
    fetchIndicatorMap("NGDP_RPCH"),
    fetchIndicatorMap("BCA_NGDPD"),
    fetchIndicatorMap("GGXCNL_GDP"),
  ]);

  const rows = await prisma.country.findMany({
    where: { iso3: { not: null } },
    select: { id: true, iso3: true },
  });

  const updated: string[] = [];

  for (const r of rows) {
    if (!r.iso3) continue;
    const code = r.iso3.toUpperCase();
    const g = latestActual(growth[code], maxYear);
    const c = latestActual(ca[code], maxYear);
    const f = latestActual(fiscal[code], maxYear);

    if (g == null && c == null && f == null) continue;

    await prisma.country.update({
      where: { id: r.id },
      data: {
        ...(g != null ? { gdpGrowth: g } : {}),
        ...(c != null ? { imfCurrentAccountPct: c } : {}),
        ...(f != null ? { imfGovBalancePct: f } : {}),
        dataUpdatedAt: new Date(),
      },
    });
    updated.push(r.id);
  }

  return updated;
}
