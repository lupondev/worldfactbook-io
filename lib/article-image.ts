export function resolveCardImage(url?: string | null): string {
  if (!url || url.trim() === "") return "";
  if (url.includes("/api/image-proxy?url=")) {
    try {
      const proxyParam = url.split("/api/image-proxy?url=")[1];
      const decoded = decodeURIComponent(proxyParam);
      if (decoded.startsWith("http")) return decoded;
    } catch {}
  }
  return url;
}
