import { PrismaClient } from "@prisma/client";

/**
 * Prisma client for long-running scripts (seed, batch jobs).
 * Prefer DIRECT_URL (Neon direct `postgresql://…`) when DATABASE_URL is Prisma Accelerate (`prisma+postgres://…`),
 * since Accelerate can fail from some networks or tooling.
 */
export function createScriptPrismaClient(): PrismaClient {
  const direct = process.env.DIRECT_URL?.trim();
  const primary = process.env.DATABASE_URL?.trim();
  const url = direct || primary;
  if (!url) {
    throw new Error("DATABASE_URL is required (set DIRECT_URL for direct Postgres when using Accelerate).");
  }
  if (!direct && primary?.startsWith("prisma+")) {
    console.warn(
      "[prisma-script] DATABASE_URL uses Prisma Accelerate. Set DIRECT_URL to your Neon PostgreSQL URL for reliable seeds and migrations."
    );
  }
  return new PrismaClient({
    datasources: { db: { url } },
  });
}
