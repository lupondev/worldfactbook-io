import type { Country } from "@prisma/client";

import { jsonSafe } from "./json";

export type CountryPublic = ReturnType<typeof toCountryPublic>;

export function toCountryPublic(c: Country) {
  return jsonSafe(c) as Omit<Country, "population"> & { population: string | null };
}

export function countryListItem(c: Country) {
  return {
    name: c.name,
    slug: c.slug,
    flag: c.flag,
    region: c.region,
    capital: c.capital,
    gdp: c.gdp,
    gdpPerCapita: c.gdpPerCapita,
    population: c.population?.toString() ?? null,
    hdiScore: c.hdiScore,
    democracyScore: c.democracyScore,
    corruptionIndex: c.corruptionIndex,
    dataUpdatedAt: c.dataUpdatedAt.toISOString(),
  };
}
