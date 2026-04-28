import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const relationSelect = {
  include: {
    fromEntity: { select: { slug: true, nameBs: true } },
    toEntity: { select: { slug: true, nameBs: true } },
  },
} as const;

function entityMetadataRole(meta: Prisma.JsonValue | null | undefined): string | null {
  if (meta == null || typeof meta !== "object" || Array.isArray(meta)) return null;
  const r = (meta as Record<string, unknown>).role;
  return typeof r === "string" ? r : null;
}

function entityMetadataActiveFrom(meta: Prisma.JsonValue | null | undefined): string | null {
  if (meta == null || typeof meta !== "object" || Array.isArray(meta)) return null;
  const r = (meta as Record<string, unknown>).activeFromIso;
  return typeof r === "string" ? r : null;
}

export function schemaKindFromEntityType(
  type: string,
): "Person" | "Organization" | "Event" | "AdministrativeArea" | "Legislation" {
  const t = type.toLowerCase();
  switch (t) {
    case "person":
    case "player":
      return "Person";
    case "org":
    case "organization":
    case "club":
      return "Organization";
    case "event":
      return "Event";
    case "place":
      return "AdministrativeArea";
    case "law":
      return "Legislation";
    default:
      return "Person";
  }
}

export async function fetchEntityWithGraph(slug: string) {
  return prisma.entity.findUnique({
    where: { slug },
    include: {
      entityDecisions: { orderBy: { createdAt: "desc" } },
      entityArticles: { orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }] },
      outgoingRelations: relationSelect,
      incomingRelations: relationSelect,
    },
  });
}

export type EntityWithGraphNonNull = NonNullable<Awaited<ReturnType<typeof fetchEntityWithGraph>>>;

function firstLineSummary(context: string | null | undefined, max = 280) {
  const trimmed = context?.trim();
  if (!trimmed) return undefined;
  return trimmed.split(/\n/)[0]?.slice(0, max);
}

export async function serializeEntity(entity: EntityWithGraphNonNull) {
  const roleMeta = entityMetadataRole(entity.metadata);
  const role = entity.role?.trim() || roleMeta;
  const activeFrom =
    entity.activeFrom?.toISOString() ?? entityMetadataActiveFrom(entity.metadata);
  const schemaKind = entity.schemaKind?.trim() || schemaKindFromEntityType(entity.type);

  const decisionIds = Array.from(new Set(entity.entityDecisions.map((d) => d.decisionId)));
  const decisionRows =
    decisionIds.length > 0
      ? await prisma.decision.findMany({
          where: { id: { in: decisionIds } },
          select: {
            id: true,
            title: true,
            decisionDate: true,
            slug: true,
            createdAt: true,
          },
        })
      : [];
  const decisionById = new Map(decisionRows.map((d) => [d.id, d]));

  const decisions = entity.entityDecisions.map((d) => {
    const row = decisionById.get(d.decisionId);
    const fallbackTitle = firstLineSummary(d.context) ?? d.decisionId;
    const title = row?.title?.trim() || fallbackTitle;
    const at = row?.decisionDate ?? row?.createdAt ?? d.createdAt;
    return {
      id: d.id,
      title,
      summary: d.context,
      decidedAt: at.toISOString(),
      role: d.role,
      slug: row?.slug ?? null,
    };
  });

  const articles = entity.entityArticles.map((a) => ({
    id: a.id,
    title: a.title?.trim() || a.articleId,
    url: a.url ?? null,
    slug: a.slug ?? a.articleId,
    publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
  }));

  const outRelations = entity.outgoingRelations.map((r) => ({
    id: r.id,
    relationType: r.type,
    label: r.notes?.trim() ? r.notes.trim() : r.toEntity.nameBs,
    createdAt: r.createdAt.toISOString(),
    from: r.fromEntity,
    to: r.toEntity,
  }));
  const inRelations = entity.incomingRelations.map((r) => ({
    id: r.id,
    relationType: r.type,
    label: r.notes?.trim() ? r.notes.trim() : r.fromEntity.nameBs,
    createdAt: r.createdAt.toISOString(),
    from: r.fromEntity,
    to: r.toEntity,
  }));
  const relationCount = entity.outgoingRelations.length + entity.incomingRelations.length;

  return {
    id: entity.id,
    slug: entity.slug,
    nameBs: entity.nameBs,
    nameEn: entity.nameEn,
    type: entity.type,
    role,
    shortBio: entity.shortBio,
    bioRich: entity.bioRich,
    imageUrl: entity.imageUrl,
    avatar: entity.avatar,
    activeFrom,
    schemaKind,
    counts: {
      decisions: entity.entityDecisions.length,
      articles: entity.entityArticles.length,
      relations: relationCount,
    },
    decisions,
    articles,
    relations: { outgoing: outRelations, incoming: inRelations },
  };
}

export type SerializedEntityPublic = Awaited<ReturnType<typeof serializeEntity>>;
