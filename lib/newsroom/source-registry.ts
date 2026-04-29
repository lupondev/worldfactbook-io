export type SourceTier = "regional" | "global_original" | "specialized";
export type SourceRegion = "hr" | "ba" | "sr" | "me" | "us" | "uk" | "eu" | "global";

export interface SourceConfig {
  domain: string;
  tier: SourceTier;
  region: SourceRegion;
  language: string;
  allowedPathPatterns?: RegExp[];
  blockedPathPatterns?: RegExp[];
  allowedTopics?: string[];
  notes?: string;
}

export const SOURCE_REGISTRY: Record<string, SourceConfig> = {
  "index.hr": {
    domain: "index.hr",
    tier: "regional",
    region: "hr",
    language: "hr",
    allowedPathPatterns: [/^\/vijesti\/hrvatska/, /^\/vijesti\/zagreb/, /^\/vijesti\/regija/, /^\/sport\/hrvatska/, /^\/sport\/regija/, /^\/kultura/],
    blockedPathPatterns: [/^\/vijesti\/svijet/, /^\/sport\/svijet/, /^\/sport\/internacionalni/, /^\/tech/, /^\/scena/, /^\/biznis\/svijet/, /iz-minute-u-minutu/, /\/live/],
    allowedTopics: ["regional_hr", "regional_balkans", "culture_hr", "sport_hr"],
    notes: "HR portal. Samo HR i regionalne teme. Global vijesti uzimamo iz Reutersa.",
  },
  "jutarnji.hr": {
    domain: "jutarnji.hr",
    tier: "regional",
    region: "hr",
    language: "hr",
    allowedPathPatterns: [/^\/vijesti\/hrvatska/, /^\/vijesti\/zg/, /^\/sport\/hrvatska/, /^\/kultura/, /^\/scena\/regija/],
    blockedPathPatterns: [/^\/vijesti\/svijet/, /^\/sport\/svijet/, /^\/biznis\/svijet/, /^\/scena(?!\/regija)/, /^\/lifestyle/, /^\/tech/, /iz-minute-u-minutu/, /live-blog/],
    allowedTopics: ["regional_hr", "regional_balkans", "culture_hr", "sport_hr"],
  },
  "24sata.hr": {
    domain: "24sata.hr",
    tier: "regional",
    region: "hr",
    language: "hr",
    allowedPathPatterns: [/^\/news\/hrvatska/, /^\/sport\/hrvatska/, /^\/show\/hrvatska/],
    blockedPathPatterns: [/^\/news\/svijet/, /^\/sport\/svijet/, /^\/lifestyle/, /^\/tech/],
  },
  "rtl.hr": {
    domain: "rtl.hr",
    tier: "regional",
    region: "hr",
    language: "hr",
    allowedPathPatterns: [/^\/vijesti\/hrvatska/, /^\/sport\/hrvatska/],
    blockedPathPatterns: [/^\/vijesti\/svijet/, /^\/lifestyle/],
  },
  "avaz.ba": {
    domain: "avaz.ba",
    tier: "regional",
    region: "ba",
    language: "bs",
    allowedPathPatterns: [/^\/vijesti\/bih/, /^\/vijesti\/regija/, /^\/vijesti\/sarajevo/, /^\/sport/, /^\/kultura/],
    blockedPathPatterns: [/^\/vijesti\/svijet/, /^\/lifestyle/, /^\/tech/, /^\/showbiz/],
  },
  "klix.ba": {
    domain: "klix.ba",
    tier: "regional",
    region: "ba",
    language: "bs",
    allowedPathPatterns: [/^\/vijesti\/bih/, /^\/biznis\/bih/, /^\/sport\/bih/, /^\/kultura/],
    blockedPathPatterns: [/^\/vijesti\/svijet/, /^\/sport\/svijet/, /^\/scitech/, /^\/magazin/],
  },
  "n1info.ba": {
    domain: "n1info.ba",
    tier: "regional",
    region: "ba",
    language: "bs",
    allowedPathPatterns: [/\/bih/, /\/regija/, /\/sarajevo/],
    blockedPathPatterns: [/\/svijet/, /\/lifestyle/],
  },
  "oslobodjenje.ba": {
    domain: "oslobodjenje.ba",
    tier: "regional",
    region: "ba",
    language: "bs",
    allowedPathPatterns: [/^\/vijesti\/bih/, /^\/vijesti\/regija/, /^\/kultura/, /^\/sport\/bih/],
    blockedPathPatterns: [/^\/vijesti\/svijet/],
  },
  "reuters.com": { domain: "reuters.com", tier: "global_original", region: "global", language: "en" },
  "apnews.com": { domain: "apnews.com", tier: "global_original", region: "global", language: "en" },
  "afp.com": { domain: "afp.com", tier: "global_original", region: "global", language: "en" },
  "bbc.com": { domain: "bbc.com", tier: "global_original", region: "global", language: "en" },
  "cnn.com": { domain: "cnn.com", tier: "global_original", region: "global", language: "en" },
  "aljazeera.com": { domain: "aljazeera.com", tier: "global_original", region: "global", language: "en" },
  "theguardian.com": { domain: "theguardian.com", tier: "global_original", region: "uk", language: "en" },
  "bloomberg.com": { domain: "bloomberg.com", tier: "global_original", region: "global", language: "en" },
  "ft.com": { domain: "ft.com", tier: "global_original", region: "uk", language: "en" },
  "nytimes.com": { domain: "nytimes.com", tier: "global_original", region: "us", language: "en" },
  "wsj.com": { domain: "wsj.com", tier: "global_original", region: "us", language: "en" },
  "politico.com": { domain: "politico.com", tier: "global_original", region: "us", language: "en" },
  "politico.eu": { domain: "politico.eu", tier: "global_original", region: "eu", language: "en" },
  "euronews.com": { domain: "euronews.com", tier: "global_original", region: "eu", language: "en" },
  "dw.com": { domain: "dw.com", tier: "global_original", region: "eu", language: "en" },
  "axios.com": { domain: "axios.com", tier: "global_original", region: "us", language: "en" },
  "theathletic.com": { domain: "theathletic.com", tier: "specialized", region: "global", language: "en", allowedTopics: ["sport"] },
  "theverge.com": { domain: "theverge.com", tier: "specialized", region: "global", language: "en", allowedTopics: ["tech"] },
  "arstechnica.com": { domain: "arstechnica.com", tier: "specialized", region: "global", language: "en", allowedTopics: ["tech"] },
};
