import { prisma } from "@/lib/prisma";

export async function getAllCountrySlugs(): Promise<string[]> {
  try {
    const rows = await prisma.country.findMany({
      select: { slug: true },
      orderBy: { slug: "asc" },
    });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}

export async function getAllEntitySlugs(): Promise<string[]> {
  try {
    const rows = await prisma.entity.findMany({
      select: { slug: true },
      orderBy: { slug: "asc" },
    });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}

export async function getAllLiveBlogSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.liveBlog.findMany({
      where: { deletedAt: null },
      select: { slug: true },
      orderBy: { slug: "asc" },
    });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}

export async function getAllDecisionSlugs(): Promise<string[]> {
  const diurnaBase = process.env.NEXT_PUBLIC_DIURNA_URL || "https://diurna.vercel.app";
  try {
    const res = await fetch(`${diurnaBase}/api/public/decisions?site=novi.ba&minImpact=7&pageSize=100`);
    if (!res.ok) return [];
    const payload = (await res.json()) as { items?: Array<{ slug?: string; id?: string }> };
    return (payload.items || [])
      .map((i) => i.slug || i.id || "")
      .filter((x) => x.length > 0);
  } catch {
    return [];
  }
}

export async function getAllQuizSlugs(): Promise<string[]> {
  const diurnaBase = process.env.NEXT_PUBLIC_DIURNA_URL || "https://diurna.vercel.app";
  try {
    const res = await fetch(`${diurnaBase}/api/public/quizzes?site=novi.ba&pageSize=50`);
    if (!res.ok) return [];
    const payload = (await res.json()) as { items?: Array<{ slug?: string; id?: string }> };
    return (payload.items || [])
      .map((i) => i.slug || i.id || "")
      .filter((x) => x.length > 0);
  } catch {
    return [];
  }
}

export async function countryStaticParams() {
  const slugs = await getAllCountrySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function entityStaticParams() {
  const slugs = await getAllEntitySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function liveBlogStaticParams() {
  const slugs = await getAllLiveBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function decisionStaticParams() {
  const slugs = await getAllDecisionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function quizStaticParams() {
  const slugs = await getAllQuizSlugs();
  return slugs.map((slug) => ({ slug }));
}
