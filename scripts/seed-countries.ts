/**
 * Seed countries from factbook/factbook.json (GitHub tarball).
 * Primary monolithic URLs from the spec 404; this uses the maintained regional JSON files.
 *
 * Run: npx ts-node scripts/seed-countries.ts  (see ts-node in package.json)
 * Or:  npm run seed:countries
 */
import "dotenv/config";
import { execFileSync } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const TARBALL =
  "https://codeload.github.com/factbook/factbook.json/tar.gz/refs/heads/master";

const MONOLITHIC_URLS = [
  "https://raw.githubusercontent.com/factbook/factbook.json/master/data/factbook.json",
  "https://raw.githubusercontent.com/iancoleman/cia_world_factbook_api/master/data/all.json",
];

const REGION_LABEL: Record<string, string> = {
  africa: "Africa",
  antarctica: "Antarctica",
  "australia-oceania": "Australia - Oceania",
  "central-america-n-caribbean": "Central America and the Caribbean",
  "central-asia": "Central Asia",
  "east-n-southeast-asia": "East and Southeast Asia",
  europe: "Europe",
  "middle-east": "Middle East",
  "north-america": "North America",
  oceans: "Oceans",
  "south-america": "South America",
  "south-asia": "South Asia",
  world: "World",
};

const TLD_TO_ISO2: Record<string, string> = {
  uk: "GB",
  el: "GR",
  ay: "AQ",
};

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function firstText(node: unknown): string | undefined {
  if (node == null) return undefined;
  if (typeof node === "string") return stripHtml(node);
  if (typeof node === "object" && "text" in (node as object)) {
    const t = (node as { text?: string }).text;
    return t ? stripHtml(t) : undefined;
  }
  return undefined;
}

function walkTexts(obj: unknown, out: string[]): void {
  if (obj == null) return;
  if (typeof obj === "string") {
    out.push(stripHtml(obj));
    return;
  }
  if (typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    for (const x of obj) walkTexts(x, out);
    return;
  }
  for (const v of Object.values(obj as Record<string, unknown>)) {
    if (v && typeof v === "object" && "text" in (v as object)) {
      const t = (v as { text?: string }).text;
      if (t) out.push(stripHtml(t));
    }
    walkTexts(v, out);
  }
}

function parseFirstBigInt(text: string | undefined): bigint | null {
  if (!text) return null;
  const m = text.replace(/,/g, "").match(/\d[\d\s]*/);
  if (!m) return null;
  const n = BigInt(m[0].replace(/\s/g, ""));
  return n;
}

function parseFirstFloat(text: string | undefined): number | null {
  if (!text) return null;
  const t = text.replace(/,/g, "");
  const m = t.match(/-?\d+(\.\d+)?/);
  if (!m) return null;
  return parseFloat(m[0]);
}

function parseMoneyBillions(text: string | undefined): number | null {
  if (!text) return null;
  const lower = text.toLowerCase();
  const n = parseFirstFloat(text);
  if (n == null) return null;
  if (lower.includes("trillion")) return n * 1000;
  if (lower.includes("billion")) return n;
  if (lower.includes("million")) return n / 1000;
  return n;
}

function parseGdpPerCapita(text: string | undefined): number | null {
  if (!text) return null;
  const m = text.match(/\$([\d,]+(?:\.\d+)?)/);
  if (!m) return null;
  return parseFloat(m[1].replace(/,/g, ""));
}

function parseAreaSqKm(text: string | undefined): number | null {
  if (!text) return null;
  const t = text.replace(/,/g, "");
  const m = t.match(/([\d.]+)\s*sq\s*km/i);
  if (!m) return null;
  return parseFloat(m[1]);
}

function internetTldToIso2(tld: string | undefined): string | null {
  if (!tld) return null;
  const raw = tld.replace(/^\./, "").toLowerCase();
  if (raw.length !== 2) return null;
  return (TLD_TO_ISO2[raw] || raw).toUpperCase();
}

function iso2ToFlag(iso2: string | null | undefined): string {
  if (!iso2 || iso2.length !== 2) return "🏳️";
  const a = iso2.toUpperCase();
  const A = 0x1f1e6;
  return String.fromCodePoint(A + a.charCodeAt(0) - 65, A + a.charCodeAt(1) - 65);
}

function getCountryName(gov: Record<string, unknown> | undefined): { short?: string; long?: string } {
  if (!gov) return {};
  const cn = gov["Country name"] as Record<string, unknown> | undefined;
  if (!cn) return {};
  let short: string | undefined;
  let long: string | undefined;
  for (const [k, v] of Object.entries(cn)) {
    const t = firstText(v);
    if (!t || t === "none") continue;
    if (k.includes("short")) short = t;
    if (k.includes("long")) long = t;
  }
  return { short, long };
}

function getCapital(gov: Record<string, unknown> | undefined): string | undefined {
  if (!gov) return undefined;
  const cap = gov.Capital as Record<string, unknown> | undefined;
  if (!cap) return undefined;
  const name = cap.name as { text?: string } | undefined;
  return name?.text ? stripHtml(name.text) : undefined;
}

function getIntroduction(data: Record<string, unknown>): string | undefined {
  const intro = data.Introduction as Record<string, unknown> | undefined;
  const bg = intro?.Background as { text?: string } | undefined;
  return bg?.text ? stripHtml(bg.text) : undefined;
}

function getPopulationTotal(people: Record<string, unknown> | undefined): bigint | null {
  if (!people) return null;
  const pop = people.Population as Record<string, unknown> | undefined;
  if (!pop) return null;
  const total = pop.total as { text?: string } | undefined;
  if (total?.text) return parseFirstBigInt(total.text);
  const direct = pop as { text?: string };
  if (direct.text) return parseFirstBigInt(direct.text);
  return null;
}

function getAreaTotal(geo: Record<string, unknown> | undefined): number | null {
  if (!geo) return null;
  const area = geo.Area as Record<string, unknown> | undefined;
  if (!area) return null;
  for (const key of Object.keys(area)) {
    const k = key.trim();
    if (k === "total" || k.startsWith("total")) {
      const node = area[key] as { text?: string } | undefined;
      const sq = parseAreaSqKm(node?.text);
      if (sq != null) return sq;
    }
  }
  return null;
}

function pickEconomyMetrics(econ: Record<string, unknown> | undefined): {
  gdp: number | null;
  gdpPerCapita: number | null;
  gdpGrowth: number | null;
  inflation: number | null;
  unemployment: number | null;
  publicDebt: number | null;
} {
  const out = {
    gdp: null as number | null,
    gdpPerCapita: null as number | null,
    gdpGrowth: null as number | null,
    inflation: null as number | null,
    unemployment: null as number | null,
    publicDebt: null as number | null,
  };
  if (!econ) return out;
  const gdpOer = econ["GDP (official exchange rate)"] as { text?: string } | undefined;
  out.gdp = parseMoneyBillions(gdpOer?.text);

  const rpc = econ["Real GDP per capita"] as Record<string, unknown> | undefined;
  if (rpc) {
    const years = Object.keys(rpc)
      .filter((k) => k.startsWith("Real GDP per capita"))
      .map((k) => {
        const m = k.match(/(\d{4})/);
        return m ? parseInt(m[1], 10) : 0;
      });
    const latest = Math.max(0, ...years);
    const key = Object.keys(rpc).find((k) => k.includes(String(latest))) || Object.keys(rpc)[0];
    if (key && key !== "note") {
      const node = rpc[key] as { text?: string };
      out.gdpPerCapita = parseGdpPerCapita(node?.text);
    }
  }

  const growth = econ["Real GDP growth rate"] as Record<string, unknown> | undefined;
  if (growth) {
    const yk = Object.keys(growth).find((k) => /\d{4}/.test(k) && k !== "note");
    if (yk) {
      const node = growth[yk] as { text?: string };
      out.gdpGrowth = parseFirstFloat(node?.text);
    }
  }

  const infl = econ["Inflation rate (consumer prices)"] as Record<string, unknown> | undefined;
  if (infl) {
    const yk = Object.keys(infl).find((k) => /\d{4}/.test(k) && k !== "note");
    if (yk) {
      const node = infl[yk] as { text?: string };
      out.inflation = parseFirstFloat(node?.text);
    }
  }

  const unemp = econ["Unemployment rate"] as Record<string, unknown> | undefined;
  if (unemp) {
    const yk = Object.keys(unemp).find((k) => /\d{4}/.test(k) && k !== "note");
    if (yk) {
      const node = unemp[yk] as { text?: string };
      out.unemployment = parseFirstFloat(node?.text);
    }
  }

  const debt = econ["Public debt"] as Record<string, unknown> | undefined;
  if (debt) {
    const yk = Object.keys(debt).find((k) => /\d{4}/.test(k) && k !== "note");
    if (yk) {
      const node = debt[yk] as { text?: string };
      out.publicDebt = parseFirstFloat(node?.text);
    }
  }

  return out;
}

function getLiteracy(people: Record<string, unknown> | undefined): number | null {
  if (!people) return null;
  const lit = people["Literacy"] as Record<string, unknown> | undefined;
  if (!lit) return null;
  const total = lit.total as { text?: string } | undefined;
  return parseFirstFloat(total?.text);
}

function getLifeExpectancy(people: Record<string, unknown> | undefined): number | null {
  if (!people) return null;
  const le = people["Life expectancy at birth"] as Record<string, unknown> | undefined;
  if (!le) return null;
  const total = le["total population"] as { text?: string } | undefined;
  return parseFirstFloat(total?.text);
}

async function downloadTarball(dir: string): Promise<void> {
  const res = await fetch(TARBALL);
  if (!res.ok) throw new Error(`Failed to download tarball: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const tgz = path.join(dir, "factbook.tgz");
  await fs.promises.writeFile(tgz, buf);
  execFileSync("tar", ["-xzf", tgz, "-C", dir, "--strip-components=1"]);
  await fs.promises.unlink(tgz);
}

async function tryMonolithic(): Promise<Record<string, unknown>[] | null> {
  for (const url of MONOLITHIC_URLS) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const j = (await res.json()) as unknown;
      if (Array.isArray(j)) return j as Record<string, unknown>[];
      if (j && typeof j === "object") {
        const o = j as Record<string, unknown>;
        if (Array.isArray(o.countries)) return o.countries as Record<string, unknown>[];
        return Object.values(o).filter((v) => v && typeof v === "object") as Record<string, unknown>[];
      }
    } catch {
      /* try next */
    }
  }
  return null;
}

function mapRegionFolder(folder: string): string {
  return REGION_LABEL[folder] || folder.replace(/-/g, " ");
}

async function main() {
  const tmp = await fs.promises.mkdtemp(path.join(os.tmpdir(), "factbook-"));
  let records: Array<{ regionFolder: string; ciaCode: string; data: Record<string, unknown> }> = [];

  const mono = await tryMonolithic();
  if (mono?.length) {
    console.log(`Using monolithic dataset (${mono.length} rows)`);
    for (const row of mono) {
      const code = String((row as { ciaCode?: string; code?: string }).ciaCode || (row as { code?: string }).code || "")
        .toLowerCase()
        .slice(0, 3);
      if (!code) continue;
      records.push({ regionFolder: "world", ciaCode: code, data: row });
    }
  } else {
    console.log("Downloading factbook.json tarball…");
    await downloadTarball(tmp);
    const root = tmp;
    const entries = await fs.promises.readdir(root, { withFileTypes: true });
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      if (ent.name === "meta" || ent.name === ".github") continue;
      const sub = path.join(root, ent.name);
      const files = await fs.promises.readdir(sub);
      for (const f of files) {
        if (!f.endsWith(".json")) continue;
        const full = path.join(sub, f);
        const raw = await fs.promises.readFile(full, "utf8");
        let data: Record<string, unknown>;
        try {
          data = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          continue;
        }
        const ciaCode = f.replace(/\.json$/i, "").toLowerCase();
        records.push({ regionFolder: ent.name, ciaCode, data });
      }
    }
    await fs.promises.rm(tmp, { recursive: true, force: true });
  }

  console.log(`Parsed ${records.length} country files`);

  const slugCounts = new Map<string, number>();
  const rows: Prisma.CountryCreateManyInput[] = [];

  for (const { regionFolder, ciaCode, data } of records) {
    const gov = data.Government as Record<string, unknown> | undefined;
    const { short, long } = getCountryName(gov);
    const name = short || long || ciaCode.toUpperCase();
    const officialName = long && long !== short ? long : null;

    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
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

    rows.push({
      slug,
      ciaCode,
      name,
      officialName,
      region: mapRegionFolder(regionFolder),
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
    });
  }

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

  await prisma.$transaction([
    prisma.country.deleteMany(),
    prisma.dataSource.deleteMany(),
    prisma.country.createMany({ data: rows }),
    prisma.dataSource.createMany({
      data: sources.map((s) => ({
        name: s.name,
        lastSync: new Date(),
        status: s.status,
      })),
    }),
  ]);

  console.log(`Seeded ${rows.length} countries and ${sources.length} data sources.`);

  // Live feed text samples (for dev verification)
  const sample: string[] = [];
  for (const r of rows.slice(0, 3)) {
    const econ = r.economy as Record<string, unknown> | undefined;
    const texts: string[] = [];
    walkTexts(econ, texts);
    sample.push(texts[0] || r.name);
  }
  console.log("Sample economy blurbs:", sample);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
