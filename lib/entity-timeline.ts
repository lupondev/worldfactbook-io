import type { SerializedEntityPublic } from "@/lib/entities-public";

export type TimelineEvent = {
  id: string;
  kind: "decision" | "article" | "relation";
  at: string;
  title: string;
  detail?: string;
};

export function buildEntityTimeline(
  payload: SerializedEntityPublic,
  limit?: number,
): TimelineEvent[] {
  const out: TimelineEvent[] = [];
  for (const d of payload.decisions) {
    out.push({
      id: `d-${d.id}`,
      kind: "decision",
      at: d.decidedAt,
      title: d.title,
      detail: d.role,
    });
  }
  for (const a of payload.articles) {
    if (!a.publishedAt) continue;
    out.push({
      id: `a-${a.id}`,
      kind: "article",
      at: a.publishedAt,
      title: a.title,
    });
  }
  for (const r of payload.relations.outgoing) {
    out.push({
      id: `ro-${r.id}`,
      kind: "relation",
      at: r.createdAt,
      title: `${r.from.nameBs} → ${r.relationType} → ${r.label}`,
      detail: r.to.nameBs,
    });
  }
  for (const r of payload.relations.incoming) {
    out.push({
      id: `ri-${r.id}`,
      kind: "relation",
      at: r.createdAt,
      title: `${r.from.nameBs} → ${r.relationType} → ${r.label}`,
      detail: r.to.nameBs,
    });
  }
  out.sort((x, y) => (x.at < y.at ? 1 : x.at > y.at ? -1 : 0));
  if (limit != null) return out.slice(0, limit);
  return out;
}
