export function resolveCardImage(url?: string | null): string {
  if (!url || url.trim() === "") return "";
  if (url.startsWith("http") && !url.includes("_next")) return url;
  return url;
}
