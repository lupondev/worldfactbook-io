export type RestCountry = {
  name: { common: string; official: string };
  cca2: string;
  cca3: string;
  flag: string;
  capital?: string[];
  area?: number;
  population?: number;
  region?: string;
  subregion?: string;
  altSpellings?: string[];
};

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenOverlap(a: string, b: string): number {
  const ta = new Set(norm(a).split(" ").filter(Boolean));
  const tb = new Set(norm(b).split(" ").filter(Boolean));
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  ta.forEach((x) => {
    if (tb.has(x)) inter += 1;
  });
  return inter / Math.max(ta.size, tb.size);
}

export async function fetchRestCountriesDataset(): Promise<RestCountry[]> {
  const url =
    "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flag,capital,area,population,region,subregion,altSpellings";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`REST Countries failed: ${res.status}`);
  return (await res.json()) as RestCountry[];
}

/**
 * Match CIA country name / partial ISO to REST Countries entry.
 */
export function matchRestCountry(
  all: RestCountry[],
  input: { name: string; iso2: string | null | undefined; iso3: string | null | undefined },
): RestCountry | null {
  const n = norm(input.name);
  if (input.iso3) {
    const ex = all.find((c) => c.cca3?.toUpperCase() === input.iso3!.toUpperCase());
    if (ex) return ex;
  }
  if (input.iso2) {
    const ex = all.find((c) => c.cca2?.toUpperCase() === input.iso2!.toUpperCase());
    if (ex) return ex;
  }

  let best: RestCountry | null = null;
  let bestScore = 0;
  for (const c of all) {
    const common = norm(c.name.common);
    const official = norm(c.name.official);
    if (n === common || n === official) return c;
    let s = tokenOverlap(input.name, c.name.common);
    s = Math.max(s, tokenOverlap(input.name, c.name.official));
    for (const alt of c.altSpellings || []) {
      s = Math.max(s, tokenOverlap(input.name, alt));
    }
    if (s > bestScore) {
      bestScore = s;
      best = c;
    }
  }
  if (best && bestScore >= 0.45) return best;
  return null;
}
