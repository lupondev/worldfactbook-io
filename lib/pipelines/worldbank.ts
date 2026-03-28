import type { PrismaClient } from "@prisma/client";

import { sleep } from "./sleep";

const BASE = "https://api.worldbank.org/v2/country";

const INDICATORS: { id: string; field: keyof WorldBankPatch }[] = [
  { id: "NY.GDP.MKTP.CD", field: "gdpUsd" },
  { id: "NY.GDP.PCAP.CD", field: "gdpPerCapita" },
  { id: "NY.GDP.MKTP.KD.ZG", field: "gdpGrowth" },
  { id: "FP.CPI.TOTL.ZG", field: "inflation" },
  { id: "SL.UEM.TOTL.ZS", field: "unemployment" },
  { id: "SP.POP.TOTL", field: "population" },
  { id: "SP.DYN.LE00.IN", field: "lifeExpectancy" },
  { id: "SE.ADT.LITR.ZS", field: "literacyRate" },
  { id: "GC.DOD.TOTL.GD.ZS", field: "publicDebt" },
];

type WorldBankPatch = {
  gdpUsd: number | null;
  gdpPerCapita: number | null;
  gdpGrowth: number | null;
  inflation: number | null;
  unemployment: number | null;
  population: bigint | null;
  lifeExpectancy: number | null;
  literacyRate: number | null;
  publicDebt: number | null;
};

function wbFirstValue(json: unknown): number | null {
  if (!Array.isArray(json) || json.length < 2) return null;
  const arr = json[1] as unknown;
  if (!Array.isArray(arr) || !arr[0]) return null;
  const row = arr[0] as { value?: number | null };
  if (row.value == null || Number.isNaN(Number(row.value))) return null;
  return Number(row.value);
}

async function fetchIndicator(iso2: string, indicator: string): Promise<number | null> {
  const url = `${BASE}/${iso2}/indicator/${indicator}?format=json&mrv=1`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = (await res.json()) as unknown;
  return wbFirstValue(json);
}

/**
 * Fetches latest World Bank observations for one country (iso2).
 * Delays `delayMs` between HTTP calls.
 */
export async function syncWorldBank(
  prisma: PrismaClient,
  countryId: string,
  iso2: string,
  delayMs = 100,
): Promise<boolean> {
  const upper = iso2.toUpperCase();
  const patch: WorldBankPatch = {
    gdpUsd: null,
    gdpPerCapita: null,
    gdpGrowth: null,
    inflation: null,
    unemployment: null,
    population: null,
    lifeExpectancy: null,
    literacyRate: null,
    publicDebt: null,
  };

  for (const { id, field } of INDICATORS) {
    const v = await fetchIndicator(upper, id);
    if (field === "population") {
      patch.population = v != null ? BigInt(Math.round(v)) : null;
    } else {
      (patch as Record<string, number | null>)[field] = v;
    }
    await sleep(delayMs);
  }

  const gdpBillions = patch.gdpUsd != null ? patch.gdpUsd / 1e9 : null;

  const hasMetric =
    (gdpBillions != null && Number.isFinite(gdpBillions)) ||
    patch.gdpPerCapita != null ||
    patch.gdpGrowth != null ||
    patch.inflation != null ||
    patch.unemployment != null ||
    patch.population != null ||
    patch.lifeExpectancy != null ||
    patch.literacyRate != null ||
    patch.publicDebt != null;

  if (!hasMetric) return false;

  await prisma.country.update({
    where: { id: countryId },
    data: {
      ...(gdpBillions != null && Number.isFinite(gdpBillions) ? { gdp: gdpBillions } : {}),
      ...(patch.gdpPerCapita != null ? { gdpPerCapita: patch.gdpPerCapita } : {}),
      ...(patch.gdpGrowth != null ? { gdpGrowth: patch.gdpGrowth } : {}),
      ...(patch.inflation != null ? { inflation: patch.inflation } : {}),
      ...(patch.unemployment != null ? { unemployment: patch.unemployment } : {}),
      ...(patch.population != null ? { population: patch.population } : {}),
      ...(patch.lifeExpectancy != null ? { lifeExpectancy: patch.lifeExpectancy } : {}),
      ...(patch.literacyRate != null ? { literacyRate: patch.literacyRate } : {}),
      ...(patch.publicDebt != null ? { publicDebt: patch.publicDebt } : {}),
      dataUpdatedAt: new Date(),
    },
  });

  return true;
}

export async function syncAllWorldBank(prisma: PrismaClient, delayMs = 100): Promise<string[]> {
  const rows = await prisma.country.findMany({
    where: { iso2: { not: null } },
    select: { id: true, iso2: true },
  });
  const updated: string[] = [];
  for (const r of rows) {
    if (!r.iso2) continue;
    try {
      const ok = await syncWorldBank(prisma, r.id, r.iso2, delayMs);
      if (ok) updated.push(r.id);
    } catch {
      /* skip */
    }
  }
  return updated;
}
