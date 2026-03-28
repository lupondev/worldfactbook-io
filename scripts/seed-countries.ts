/**
 * Seed / upsert CIA Factbook JSON into Postgres.
 * 1) Tries https://raw.githubusercontent.com/factbook/factbook.json/master/index.json
 * 2) Falls back to GitHub tree listing + per-file raw fetch
 * 3) Enriches flags + ISO + capital + area via REST Countries
 *
 * Run: npx ts-node scripts/seed-countries.ts
 * Or:  npm run seed:countries
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import {
  getAreaTotal,
  getCapital,
  getCountryName,
  getIntroduction,
  getLifeExpectancy,
  getLiteracy,
  getPopulationTotal,
  internetTldToIso2,
  iso2ToFlag,
  pickEconomyMetrics,
} from "../lib/factbook/parse";
import { fetchRestCountriesDataset, matchRestCountry } from "../lib/pipelines/restcountries";

const prisma = new PrismaClient();

const RAW_BASE = "https://raw.githubusercontent.com/factbook/factbook.json/master";
const INDEX_URL = `${RAW_BASE}/index.json`;
const TREE_URL = "https://api.github.com/repos/factbook/factbook.json/git/trees/master?recursive=1";

const REGIONS: Record<string, string> = {
  africa: "Africa",
  antarctica: "Antarctica",
  "australia-oceania": "Australia-Oceania",
  "central-america-n-caribbean": "Central America and Caribbean",
  "central-asia": "Central Asia",
  "east-n-southeast-asia": "East & Southeast Asia",
  europe: "Europe",
  "middle-east": "Middle East",
  "north-america": "North America",
  oceans: "Oceans",
  "south-america": "South America",
  "south-asia": "South Asia",
  world: "World",
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapRegionFolder(folder: string): string {
  return REGIONS[folder] || folder.replace(/-/g, " ");
}

type IndexEntry = { path: string; regionKey: string };

function normalizeIndexJson(j: unknown): string[] | null {
  if (Array.isArray(j)) {
    const out: string[] = [];
    for (const item of j) {
      if (typeof item === "string") out.push(item);
      else if (item && typeof item === "object") {
        const o = item as Record<string, unknown>;
        const p = (o.path || o.file || o.url) as string | undefined;
        const region = o.region as string | undefined;
        const code = (o.code || o.cia || o.id) as string | undefined;
        if (p) out.push(p.replace(/^\/+/, ""));
        else if (region && code) out.push(`${region}/${String(code).replace(/\.json$/i, "")}.json`);
      }
    }
    return out.filter(Boolean);
  }
  if (j && typeof j === "object") {
    const o = j as Record<string, unknown>;
    if (Array.isArray(o.paths)) return o.paths.map(String);
    if (Array.isArray(o.entries)) return normalizeIndexJson(o.entries);
  }
  return null;
}

async function loadPathsFromIndex(): Promise<string[] | null> {
  try {
    const res = await fetch(INDEX_URL);
    if (!res.ok) return null;
    const j = (await res.json()) as unknown;
    const paths = normalizeIndexJson(j);
    if (paths?.length) return paths;
  } catch {
    /* fall through */
  }
  return null;
}

async function loadPathsFromGithubTree(): Promise<string[]> {
  const res = await fetch(TREE_URL, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "worldfactbook.io-seed",
    },
  });
  if (!res.ok) throw new Error(`GitHub tree failed: ${res.status}`);
  const json = (await res.json()) as { tree?: { path: string; type: string }[] };
  const tree = json.tree || [];
  return tree
    .filter((t) => t.type === "blob" && /\.json$/i.test(t.path))
    .map((t) => t.path)
    .filter((p) => {
      const seg = p.split("/");
      if (seg.length !== 2) return false;
      const folder = seg[0];
      if (folder === "meta" || folder === ".github") return false;
      return true;
    });
}

async function fetchCountryJson(relPath: string): Promise<Record<string, unknown> | null> {
  const url = `${RAW_BASE}/${relPath}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function pathToRegionKey(relPath: string): string {
  return relPath.split("/")[0] || "world";
}

function pathToCiaCode(relPath: string): string {
  const base = relPath.split("/").pop() || "";
  return base.replace(/\.json$/i, "").toLowerCase();
}

async function main() {
  let relPaths = await loadPathsFromIndex();
  if (!relPaths?.length) {
    console.log("index.json missing or empty — building file list from GitHub tree API…");
    relPaths = await loadPathsFromGithubTree();
  } else {
    console.log(`Loaded ${relPaths.length} paths from index.json`);
  }

  const entries: IndexEntry[] = relPaths.map((path) => ({
    path,
    regionKey: pathToRegionKey(path),
  }));

  console.log(`Fetching ${entries.length} country JSON files…`);

  const slugCounts = new Map<string, number>();

  for (const { path, regionKey } of entries) {
    const data = await fetchCountryJson(path);
    if (!data) {
      console.warn("Skip (no JSON):", path);
      continue;
    }

    const ciaCode = pathToCiaCode(path);
    const gov = data.Government as Record<string, unknown> | undefined;
    const { short, long } = getCountryName(gov);
    const name = short || long || ciaCode.toUpperCase();
    const officialName = long && long !== short ? long : null;

    let baseSlug = slugify(name);
    if (!baseSlug) baseSlug = ciaCode;
    const n = (slugCounts.get(baseSlug) || 0) + 1;
    slugCounts.set(baseSlug, n);
    const slug = n > 1 ? `${baseSlug}-${ciaCode}` : baseSlug;

    const comm = data.Communications as Record<string, unknown> | undefined;
    const icc = comm?.["Internet country code"] as { text?: string } | undefined;
    const iso2 = internetTldToIso2(icc?.text);

    const geo = data.Geography as Record<string, unknown> | undefined;
    const people = data["People and Society"] as Record<string, unknown> | undefined;
    const econ = data.Economy as Record<string, unknown> | undefined;
    const mil = (data["Military and Security"] || data.Military) as Record<string, unknown> | undefined;
    const metrics = pickEconomyMetrics(econ);

    await prisma.country.upsert({
      where: { ciaCode },
      create: {
        slug,
        ciaCode,
        name,
        officialName,
        region: mapRegionFolder(regionKey),
        subregion: null,
        flag: iso2ToFlag(iso2),
        iso2,
        iso3: null,
        capital: getCapital(gov),
        area: getAreaTotal(geo),
        population: getPopulationTotal(people),
        gdp: metrics.gdp,
        gdpPerCapita: metrics.gdpPerCapita,
        gdpGrowth: metrics.gdpGrowth,
        inflation: metrics.inflation,
        unemployment: metrics.unemployment,
        hdiRank: null,
        hdiScore: null,
        democracyScore: null,
        corruptionIndex: null,
        publicDebt: metrics.publicDebt,
        imfCurrentAccountPct: null,
        imfGovBalancePct: null,
        lifeExpectancy: getLifeExpectancy(people),
        literacyRate: getLiteracy(people),
        introduction: getIntroduction(data),
        geography: (data.Geography as object) ?? undefined,
        peopleAndSociety: (data["People and Society"] as object) ?? undefined,
        government: (data.Government as object) ?? undefined,
        economy: (data.Economy as object) ?? undefined,
        energy: (data.Energy as object) ?? undefined,
        communications: (data.Communications as object) ?? undefined,
        transportation: (data.Transportation as object) ?? undefined,
        military: (mil as object) ?? undefined,
        dataUpdatedAt: new Date(),
      },
      update: {
        slug,
        name,
        officialName,
        region: mapRegionFolder(regionKey),
        flag: iso2ToFlag(iso2),
        iso2,
        capital: getCapital(gov),
        area: getAreaTotal(geo),
        population: getPopulationTotal(people),
        gdp: metrics.gdp,
        gdpPerCapita: metrics.gdpPerCapita,
        gdpGrowth: metrics.gdpGrowth,
        inflation: metrics.inflation,
        unemployment: metrics.unemployment,
        publicDebt: metrics.publicDebt,
        lifeExpectancy: getLifeExpectancy(people),
        literacyRate: getLiteracy(people),
        introduction: getIntroduction(data),
        geography: (data.Geography as object) ?? undefined,
        peopleAndSociety: (data["People and Society"] as object) ?? undefined,
        government: (data.Government as object) ?? undefined,
        economy: (data.Economy as object) ?? undefined,
        energy: (data.Energy as object) ?? undefined,
        communications: (data.Communications as object) ?? undefined,
        transportation: (data.Transportation as object) ?? undefined,
        military: (mil as object) ?? undefined,
        dataUpdatedAt: new Date(),
      },
    });
  }

  const total = await prisma.country.count();
  console.log(`Upserted Factbook profiles. Total countries in DB: ${total}`);

  console.log("Enriching with REST Countries (flags, ISO, capital, area, population)…");
  const rc = await fetchRestCountriesDataset();
  const rows = await prisma.country.findMany();
  let enriched = 0;
  for (const c of rows) {
    const hit = matchRestCountry(rc, { name: c.name, iso2: c.iso2, iso3: c.iso3 });
    if (!hit) continue;
    const capital = hit.capital?.[0];
    const pop = hit.population != null ? BigInt(Math.round(hit.population)) : undefined;
    await prisma.country.update({
      where: { id: c.id },
      data: {
        flag: hit.flag || c.flag,
        iso2: hit.cca2?.toUpperCase() || c.iso2,
        iso3: hit.cca3?.toUpperCase() || c.iso3,
        ...(capital ? { capital } : {}),
        ...(hit.area != null ? { area: hit.area } : {}),
        ...(pop != null ? { population: pop } : {}),
        ...(hit.subregion ? { subregion: hit.subregion } : {}),
        dataUpdatedAt: new Date(),
      },
    });
    enriched += 1;
  }
  console.log(`REST Countries enrichment applied to ${enriched} rows.`);

  const sources = [
    { name: "World Bank", status: "annual" as const },
    { name: "IMF", status: "annual" as const },
    { name: "UN Data", status: "annual" as const },
    { name: "Freedom House", status: "annual" as const },
    { name: "REST Countries", status: "live" as const },
    { name: "Our World in Data", status: "annual" as const },
    { name: "Transparency International", status: "annual" as const },
    { name: "UNDP HDI", status: "annual" as const },
  ];

  await prisma.dataSource.deleteMany();
  await prisma.dataSource.createMany({
    data: sources.map((s) => ({
      name: s.name,
      lastSync: new Date(),
      status: s.status,
    })),
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
