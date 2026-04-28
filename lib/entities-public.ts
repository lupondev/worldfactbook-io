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

export function schemaKindFromEntityType(type: string): "Person" | "Organization" | "Event" | "AdministrativeArea" | "Legislation" {
  switch (type) {
    case "person":
      return "Person";
    case "org":
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
      entityArticles: { orderBy: { createdAt: "desc" } },
      outgoingRelations: relationSelect,
      incomingRelations: relationSelect,
    },
  });
}

export type EntityWithGraphNonNull = NonNullable<Awaited<ReturnType<typeof fetchEntityWithGraph>>>;

export function serializeEntity(entity: EntityWithGraphNonNull) {
  const role = entityMetadataRole(entity.metadata);
  const activeFrom = entityMetadataActiveFrom(entity.metadata);
  const decisions = entity.entityDecisions.map((d) => {
    const trimmed = d.context?.trim();
    const firstLine = trimmed ? trimmed.split(/\n/)[0]?.slice(0, 280) : undefined;
    const title = firstLine ?? d.decisionId;
    return {
      id: d.id,
      title,
      summary: d.context,
      decidedAt: d.createdAt.toISOString(),
      role: d.role,
      slug: d.decisionId,
    };
  });
  const articles = entity.entityArticles.map((a) => ({
    id: a.id,
    title: a.articleId,
    url: null as string | null,
    slug: a.articleId,
    publishedAt: null as string | null,
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
    bioRich: null as string | null,
    imageUrl: entity.imageUrl,
    avatar: null as string | null,
    activeFrom,
    schemaKind: schemaKindFromEntityType(entity.type),
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

export type SerializedEntityPublic = ReturnType<typeof serializeEntity>;
