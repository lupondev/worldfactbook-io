function normalize(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function toTokenSet(input: string): Set<string> {
  return new Set(normalize(input).split(" ").filter(Boolean));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  Array.from(a).forEach((token) => {
    if (b.has(token)) intersection++;
  });
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function isLikelyDuplicate(candidateTitle: string, existingTitles: string[], threshold = 0.75): boolean {
  const candidate = toTokenSet(candidateTitle);
  for (const title of existingTitles) {
    const score = jaccard(candidate, toTokenSet(title));
    if (score >= threshold) return true;
  }
  return false;
}
