import { SOURCE_REGISTRY, type SourceConfig } from "@/lib/newsroom/source-registry";

export interface SourceCheckResult {
  allowed: boolean;
  reason: string;
  source?: SourceConfig;
}

export function checkSourceAllowed(sourceUrl: string): SourceCheckResult {
  if (!sourceUrl) return { allowed: false, reason: "No source URL" };

  let url: URL;
  try {
    url = new URL(sourceUrl);
  } catch {
    return { allowed: false, reason: "Invalid URL" };
  }

  const domain = url.hostname.replace(/^www\./, "").toLowerCase();
  const path = url.pathname.toLowerCase();
  const source = SOURCE_REGISTRY[domain];
  if (!source) {
    return { allowed: false, reason: `Unknown source: ${domain} (not in registry; whitelist-only policy)` };
  }

  if (source.tier === "global_original" || source.tier === "specialized") {
    if (source.blockedPathPatterns?.some((re) => re.test(path))) {
      return { allowed: false, reason: `Path explicitly blocked for ${domain}`, source };
    }
    return { allowed: true, reason: `Tier-2 source: ${domain}`, source };
  }

  if (source.blockedPathPatterns?.some((re) => re.test(path))) {
    return {
      allowed: false,
      reason: `Regional source ${domain} blocks path: ${path} (likely copy-paste from global wire)`,
      source,
    };
  }

  if (source.allowedPathPatterns && source.allowedPathPatterns.length > 0) {
    const matches = source.allowedPathPatterns.some((re) => re.test(path));
    if (!matches) {
      return { allowed: false, reason: `Regional source ${domain} - path not in allowed list: ${path}`, source };
    }
  }

  return { allowed: true, reason: `Tier-1 regional source: ${domain}`, source };
}

export function isSourceAllowed(sourceUrl: string): boolean {
  return checkSourceAllowed(sourceUrl).allowed;
}
