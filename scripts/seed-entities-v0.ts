import "dotenv/config";

import type { Prisma } from "@prisma/client";

import { createScriptPrismaClient } from "../lib/prisma-script";
import { KG_V0_ENTITIES } from "./kg-v0-data";

function schemaKindForEntityType(t: string): string {
  switch (t) {
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

const prisma = createScriptPrismaClient();

async function main() {
  for (const row of KG_V0_ENTITIES) {
    const meta = row.metadata;
    const metadata: Prisma.InputJsonValue | undefined = meta
      ? (meta as Prisma.InputJsonValue)
      : undefined;
    const roleFromMeta = meta?.role ?? null;
    const activeFromIso = meta?.activeFromIso;
    await prisma.entity.upsert({
      where: { slug: row.slug },
      create: {
        type: row.type,
        slug: row.slug,
        nameBs: row.nameBs,
        nameEn: row.nameEn ?? null,
        shortBio: row.shortBio,
        imageUrl: null,
        metadata: metadata ?? undefined,
        isVerified: true,
        schemaKind: schemaKindForEntityType(row.type),
        role: roleFromMeta,
        activeFrom: activeFromIso ? new Date(activeFromIso) : null,
        bioRich: null,
        avatar: null,
      },
      update: {
        type: row.type,
        nameBs: row.nameBs,
        nameEn: row.nameEn ?? null,
        shortBio: row.shortBio,
        imageUrl: null,
        metadata: metadata ?? undefined,
        isVerified: true,
        schemaKind: schemaKindForEntityType(row.type),
        role: roleFromMeta,
        activeFrom: activeFromIso ? new Date(activeFromIso) : null,
        bioRich: null,
        avatar: null,
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
