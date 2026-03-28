import { toCountryPublic } from "@/lib/country-public";
import { corsOptions, jsonWithCors } from "@/lib/cors";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const country = await prisma.country.findUnique({ where: { slug: params.slug } });
  if (!country) return jsonWithCors({ error: "Country not found" }, { status: 404 });
  return jsonWithCors(toCountryPublic(country));
}
