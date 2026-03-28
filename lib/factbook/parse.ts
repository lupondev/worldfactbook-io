export function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function firstText(node: unknown): string | undefined {
  if (node == null) return undefined;
  if (typeof node === "string") return stripHtml(node);
  if (typeof node === "object" && "text" in (node as object)) {
    const t = (node as { text?: string }).text;
    return t ? stripHtml(t) : undefined;
  }
  return undefined;
}

const TLD_TO_ISO2: Record<string, string> = {
  uk: "GB",
  el: "GR",
  ay: "AQ",
};

export function parseFirstBigInt(text: string | undefined): bigint | null {
  if (!text) return null;
  const m = text.replace(/,/g, "").match(/\d[\d\s]*/);
  if (!m) return null;
  return BigInt(m[0].replace(/\s/g, ""));
}

export function parseFirstFloat(text: string | undefined): number | null {
  if (!text) return null;
  const t = text.replace(/,/g, "");
  const m = t.match(/-?\d+(\.\d+)?/);
  if (!m) return null;
  return parseFloat(m[0]);
}

export function parseMoneyBillions(text: string | undefined): number | null {
  if (!text) return null;
  const lower = text.toLowerCase();
  const n = parseFirstFloat(text);
  if (n == null) return null;
  if (lower.includes("trillion")) return n * 1000;
  if (lower.includes("billion")) return n;
  if (lower.includes("million")) return n / 1000;
  return n;
}

export function parseGdpPerCapita(text: string | undefined): number | null {
  if (!text) return null;
  const m = text.match(/\$([\d,]+(?:\.\d+)?)/);
  if (!m) return null;
  return parseFloat(m[1].replace(/,/g, ""));
}

export function parseAreaSqKm(text: string | undefined): number | null {
  if (!text) return null;
  const t = text.replace(/,/g, "");
  const m = t.match(/([\d.]+)\s*sq\s*km/i);
  if (!m) return null;
  return parseFloat(m[1]);
}

export function internetTldToIso2(tld: string | undefined): string | null {
  if (!tld) return null;
  const raw = tld.replace(/^\./, "").toLowerCase();
  if (raw.length !== 2) return null;
  return (TLD_TO_ISO2[raw] || raw).toUpperCase();
}

export function iso2ToFlag(iso2: string | null | undefined): string {
  if (!iso2 || iso2.length !== 2) return "🏳️";
  const a = iso2.toUpperCase();
  const A = 0x1f1e6;
  return String.fromCodePoint(A + a.charCodeAt(0) - 65, A + a.charCodeAt(1) - 65);
}

export function getCountryName(gov: Record<string, unknown> | undefined): { short?: string; long?: string } {
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

export function getCapital(gov: Record<string, unknown> | undefined): string | undefined {
  if (!gov) return undefined;
  const cap = gov.Capital as Record<string, unknown> | undefined;
  if (!cap) return undefined;
  const name = cap.name as { text?: string } | undefined;
  return name?.text ? stripHtml(name.text) : undefined;
}

export function getIntroduction(data: Record<string, unknown>): string | undefined {
  const intro = data.Introduction as Record<string, unknown> | undefined;
  const bg = intro?.Background as { text?: string } | undefined;
  return bg?.text ? stripHtml(bg.text) : undefined;
}

export function getPopulationTotal(people: Record<string, unknown> | undefined): bigint | null {
  if (!people) return null;
  const pop = people.Population as Record<string, unknown> | undefined;
  if (!pop) return null;
  const total = pop.total as { text?: string } | undefined;
  if (total?.text) return parseFirstBigInt(total.text);
  const direct = pop as { text?: string };
  if (direct.text) return parseFirstBigInt(direct.text);
  return null;
}

export function getAreaTotal(geo: Record<string, unknown> | undefined): number | null {
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

export function pickEconomyMetrics(econ: Record<string, unknown> | undefined): {
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

export function getLiteracy(people: Record<string, unknown> | undefined): number | null {
  if (!people) return null;
  const lit = people["Literacy"] as Record<string, unknown> | undefined;
  if (!lit) return null;
  const total = lit.total as { text?: string } | undefined;
  return parseFirstFloat(total?.text);
}

export function getLifeExpectancy(people: Record<string, unknown> | undefined): number | null {
  if (!people) return null;
  const le = people["Life expectancy at birth"] as Record<string, unknown> | undefined;
  if (!le) return null;
  const total = le["total population"] as { text?: string } | undefined;
  return parseFirstFloat(total?.text);
}
