import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$queryRawUnsafe<Array<{ ok: number }>>("select 1 as ok");
  } catch (err) {
    process.stderr.write(`Database unavailable, skipping proxy URL fix: ${String(err)}\n`);
    await prisma.$disconnect();
    return;
  }

  const tableExistsRows = await prisma.$queryRawUnsafe<Array<{ exists: boolean }>>(
    `select exists (
      select 1
      from information_schema.tables
      where table_schema = 'public' and table_name = 'Article'
    ) as "exists"`,
  );
  const tableExists = tableExistsRows[0]?.exists === true;
  if (!tableExists) {
    process.stdout.write("Table Article not found, nothing to fix\n");
    await prisma.$disconnect();
    return;
  }

  const articles = await prisma.$queryRawUnsafe<Array<{ id: string; featuredImage: string | null }>>(
    `select "id", "featuredImage"
     from "Article"
     where "featuredImage" like '%/api/image-proxy?url=%'`,
  );

  process.stdout.write(`Found ${articles.length} articles with proxy URLs\n`);
  let fixed = 0;

  for (const article of articles) {
    if (!article.featuredImage) continue;
    try {
      const proxyPart = article.featuredImage.split("/api/image-proxy?url=")[1];
      if (!proxyPart) continue;
      let decoded = proxyPart;
      try {
        decoded = decodeURIComponent(decoded);
      } catch {}
      try {
        decoded = decodeURIComponent(decoded);
      } catch {}
      if (!decoded.startsWith("http")) continue;
      await prisma.$executeRawUnsafe(`update "Article" set "featuredImage" = $1 where "id" = $2`, decoded, article.id);
      fixed++;
      process.stdout.write(`Fixed: ${decoded.substring(0, 80)}\n`);
    } catch (err) {
      process.stderr.write(`Error for ${article.id}: ${String(err)}\n`);
    }
  }

  process.stdout.write(`Fixed ${fixed}/${articles.length} proxy URLs\n`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  process.stderr.write(`${String(err)}\n`);
  await prisma.$disconnect();
  process.exit(0);
});
