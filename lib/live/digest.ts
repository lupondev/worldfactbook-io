import Anthropic from "@anthropic-ai/sdk";

import { prisma } from "@/lib/prisma";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });

export async function generateHourlyDigests() {
  const liveBlogs = await prisma.liveBlog.findMany({
    where: { status: "live", aiEditorEnabled: true },
  });
  for (const lb of liveBlogs) await generateDigestFor(lb.id);
}

async function generateDigestFor(liveBlogId: string) {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const updates = await prisma.liveBlogUpdate.findMany({
    where: {
      liveBlogId,
      publishedAt: { gte: since },
      updateType: { not: "digest" },
      status: "published",
    },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });
  if (updates.length < 3 || !process.env.ANTHROPIC_API_KEY) return;
  const liveBlog = await prisma.liveBlog.findUnique({ where: { id: liveBlogId } });
  if (!liveBlog) return;

  const updatesText = updates
    .map((u, i) => `${i + 1}. ${u.headline || ""}\n   ${u.body.substring(0, 300)}`)
    .join("\n\n");
  const prompt = `Sumarizuj zadnji sat live blog "${liveBlog.title}" u 3 jasna bullet pointa.

Update-i (zadnji sat):
${updatesText}

PRAVILA:
- Bosanski jezik (š č ć dž)
- 3 bullet pointa
- Svaki bullet: 1-2 rečenice
- Konkretno (ne "značajne promjene")
- Bez halucinacije - SAMO činjenice iz update-a iznad

VRATI JSON (samo JSON):
{ "bullets": ["...", "...", "..."] }`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-haiku-latest",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });
  const first = response.content[0];
  const text = first && first.type === "text" ? first.text : "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return;

  let parsed: { bullets?: string[] } = {};
  try {
    parsed = JSON.parse(match[0]) as { bullets?: string[] };
  } catch {
    return;
  }
  if (!Array.isArray(parsed.bullets) || parsed.bullets.length === 0) return;
  const body = parsed.bullets.map((b) => `• ${b}`).join("\n\n");

  await prisma.liveBlogUpdate.updateMany({
    where: { liveBlogId, updateType: "digest", pinned: true },
    data: { pinned: false },
  });
  await prisma.liveBlogUpdate.create({
    data: {
      liveBlogId,
      updateType: "digest",
      headline: "Sažetak posljednjeg sata",
      body,
      pinned: true,
      importance: 8,
      authorType: "ai",
      authorName: "AI Live Editor",
      status: "published",
    },
  });
  console.log(`[live-editor] Generated hourly digest for ${liveBlog.slug}`);
}
