export type CandidateArticle = {
  id?: string;
  title: string;
  source?: string | null;
  publishedAt?: string | null;
  clusterScore?: number | null;
};

export type DecisionResult = {
  shouldPublish: boolean;
  reason: string;
  score: number;
};

function normalize(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function scoreCandidate(article: CandidateArticle): number {
  const title = normalize(article.title);
  let score = 0;
  if (title.length >= 40) score += 20;
  if (title.length >= 70) score += 10;
  if (article.clusterScore != null) score += Math.max(0, Math.min(60, article.clusterScore));
  if (article.publishedAt) score += 10;
  if (article.source) score += 10;
  return Math.min(100, score);
}

export function decideArticle(article: CandidateArticle): DecisionResult {
  const score = scoreCandidate(article);
  if (score >= 60) return { shouldPublish: true, reason: "score_threshold_met", score };
  return { shouldPublish: false, reason: "score_too_low", score };
}
