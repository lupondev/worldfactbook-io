import { countryListItem } from "@/lib/country-public";
import { corsOptions, jsonWithCors } from "@/lib/cors";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return corsOptions();
}

export async function GET() {
  const rows = await prisma.country.findMany({
    orderBy: { name: "asc" },
  });
  return jsonWithCors(rows.map(countryListItem));
}
