export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://worldfactbook.io";

export const SITE_NAME = "World Factbook";

export const API_DATA_SOURCES =
  "CIA World Factbook (factbook.json), World Bank, IMF, UN Data, Freedom House, REST Countries, Our World in Data, Transparency International, UNDP HDI";
