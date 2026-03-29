import { SITE_URL } from "@/lib/site";

const HTML_CAP = 450_000;

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractMetaContent(html: string, attr: "property" | "name", key: string): string | null {
  const k = escapeRegExp(key);
  const re1 = new RegExp(
    `<meta[^>]+${attr}=["']${k}["'][^>]*content=["']([^"']+)["']`,
    "i",
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]*${attr}=["']${k}["']`,
    "i",
  );
  const m1 = html.match(re1);
  if (m1?.[1]?.trim()) return m1[1].trim();
  const m2 = html.match(re2);
  if (m2?.[1]?.trim()) return m2[1].trim();
  return null;
}

function pickOgOrTwitterImage(html: string): string | null {
  const og =
    extractMetaContent(html, "property", "og:image") ||
    extractMetaContent(html, "property", "og:image:url") ||
    extractMetaContent(html, "property", "og:image:secure_url");
  if (og) return og;
  const tw = extractMetaContent(html, "name", "twitter:image") || extractMetaContent(html, "name", "twitter:image:src");
  return tw || null;
}

function normalizeImageUrl(candidate: string, baseUrl: string): string | null {
  const t = candidate.trim();
  if (!t || t.startsWith("data:")) return null;
  try {
    if (t.startsWith("http://") || t.startsWith("https://")) return t;
    if (t.startsWith("//")) return `https:${t}`;
    return new URL(t, new URL(baseUrl).origin).href;
  } catch {
    return null;
  }
}

async function readHtmlChunked(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let total = "";
  while (total.length < HTML_CAP) {
    const { done, value } = await reader.read();
    if (done) break;
    total += decoder.decode(value, { stream: true });
    const lower = total.toLowerCase();
    const headEnd = lower.indexOf("</head>");
    if (headEnd !== -1) {
      total = total.slice(0, headEnd + 7);
      break;
    }
  }
  return total;
}

export async function fetchOgImageFromSourceUrl(sourceUrl: string): Promise<string | null> {
  try {
    const res = await fetch(sourceUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WorldFactbook.io/1.0; +https://worldfactbook.io/)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const html = await readHtmlChunked(res);
    const raw = pickOgOrTwitterImage(html);
    if (!raw) return null;
    return normalizeImageUrl(raw, sourceUrl);
  } catch {
    return null;
  }
}

type BingImageJson = {
  value?: Array<{ contentUrl?: string; thumbnailUrl?: string }>;
};

export async function fetchBingFeaturedImage(query: string): Promise<{ url: string; previewUrl: string } | null> {
  const key = process.env.BING_IMAGE_API_KEY;
  if (!key?.trim() || !query.trim()) return null;
  const url = new URL("https://api.bing.microsoft.com/v7.0/images/search");
  url.searchParams.set("q", query.trim().slice(0, 500));
  url.searchParams.set("mkt", "en-US");
  url.searchParams.set("safeSearch", "Moderate");
  url.searchParams.set("count", "5");
  url.searchParams.set("imageType", "Photo");
  try {
    const res = await fetch(url.toString(), {
      headers: { "Ocp-Apim-Subscription-Key": key.trim() },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as BingImageJson;
    const first = data.value?.[0];
    const contentUrl = first?.contentUrl?.trim();
    const thumbnailUrl = first?.thumbnailUrl?.trim();
    if (!contentUrl) return null;
    return { url: contentUrl, previewUrl: thumbnailUrl || contentUrl };
  } catch {
    return null;
  }
}

type PexelsJson = {
  photos?: Array<{ src?: { large2x?: string } }>;
};

export async function fetchPexelsFeaturedImage(query: string): Promise<string | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key?.trim() || !query.trim()) return null;
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query.trim().slice(0, 500));
  url.searchParams.set("per_page", "1");
  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: key.trim() },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as PexelsJson;
    const u = data.photos?.[0]?.src?.large2x?.trim();
    return u || null;
  } catch {
    return null;
  }
}

export function buildAiOgCardUrl(title: string, description?: string): string {
  const base = SITE_URL.replace(/\/$/, "");
  const u = new URL(`${base}/api/og`);
  u.searchParams.set("title", title.trim().slice(0, 200) || "WorldFactbook.io");
  if (description?.trim()) u.searchParams.set("description", description.trim().slice(0, 300));
  return u.toString();
}

export type ResolvedFeaturedImage = {
  url: string;
  previewUrl?: string;
};

export async function resolveFeaturedImage(input: {
  sourceUrl?: string | null;
  title: string;
  description?: string;
}): Promise<ResolvedFeaturedImage> {
  const title = input.title.trim() || "WorldFactbook.io";
  const searchQuery = title.slice(0, 500);

  if (input.sourceUrl?.trim()) {
    const og = await fetchOgImageFromSourceUrl(input.sourceUrl.trim());
    if (og) return { url: og, previewUrl: og };
  }

  const bing = await fetchBingFeaturedImage(searchQuery);
  if (bing) return { url: bing.url, previewUrl: bing.previewUrl };

  const pexels = await fetchPexelsFeaturedImage(searchQuery);
  if (pexels) return { url: pexels, previewUrl: pexels };

  return { url: buildAiOgCardUrl(title, input.description) };
}
