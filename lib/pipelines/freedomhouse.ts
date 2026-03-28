import type { PrismaClient } from "@prisma/client";

const OWID_CSV = "https://ourworldindata.org/grapher/freedom-score-fh.csv";

type Row = { code: string; year: number; score: number };

function parseOwidCsv(text: string): Row[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const out: Row[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/,([A-Za-z]{3}),(\d{4}),(\d+)(?:,|$)/);
    if (!m) continue;
    const code = m[1].toUpperCase();
    const year = parseInt(m[2], 10);
    const score = Math.round(parseFloat(m[3]));
    if (code.startsWith("OWID")) continue;
    if (!Number.isFinite(year) || !Number.isFinite(score)) continue;
    out.push({ code, year, score });
  }
  return out;
}

function latestByCode(rows: Row[]): Map<string, number> {
  const map = new Map<string, { year: number; score: number }>();
  for (const r of rows) {
    const prev = map.get(r.code);
    if (!prev || r.year > prev.year) map.set(r.code, { year: r.year, score: r.score });
  }
  const scores = new Map<string, number>();
  map.forEach((v, k) => scores.set(k, v.score));
  return scores;
}

/**
 * Freedom House aggregate score (0–100) via Our World in Data export (ISO3 `Code` column).
 */
export async function syncAllFreedomHouse(prisma: PrismaClient): Promise<string[]> {
  const res = await fetch(OWID_CSV);
  if (!res.ok) return [];
  const text = await res.text();
  const rows = parseOwidCsv(text);
  const byCode = latestByCode(rows);

  const countries = await prisma.country.findMany({
    where: { iso3: { not: null } },
    select: { id: true, iso3: true },
  });

  const updated: string[] = [];
  for (const c of countries) {
    if (!c.iso3) continue;
    const score = byCode.get(c.iso3.toUpperCase());
    if (score == null) continue;
    await prisma.country.update({
      where: { id: c.id },
      data: { democracyScore: score, dataUpdatedAt: new Date() },
    });
    updated.push(c.id);
  }
  return updated;
}
