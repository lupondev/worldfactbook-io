import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.liveBlog.findMany({
    where: { status: "live", deletedAt: null },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Live Blog Feed</title>
    <link>https://worldfactbook.io/live/</link>
    <description>Live updates</description>
    ${items
      .map(
        (i) => `<item>
      <title><![CDATA[${i.title}]]></title>
      <link>https://worldfactbook.io/live/${i.slug}/</link>
      <guid>https://worldfactbook.io/live/${i.slug}/</guid>
      <pubDate>${i.updatedAt.toUTCString()}</pubDate>
      <description><![CDATA[${i.description}]]></description>
    </item>`,
      )
      .join("\n")}
  </channel>
</rss>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
