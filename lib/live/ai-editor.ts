import { prisma } from "@/lib/prisma";

const SOURCE_NAME_MAP: Record<string, string> = {
  "reuters.com": "Reuters",
  "apnews.com": "AP",
  "afp.com": "AFP",
  "aljazeera.com": "Al Jazeera",
  "bbc.com": "BBC",
  "cnn.com": "CNN",
  "theguardian.com": "The Guardian",
  "nytimes.com": "NYT",
  "wsj.com": "WSJ",
  "bloomberg.com": "Bloomberg",
  "ft.com": "FT",
  "politico.com": "Politico",
  "jutarnji.hr": "Jutarnji list",
  "index.hr": "Index.hr",
  "klix.ba": "Klix.ba",
  "avaz.ba": "Avaz",
};

type ArticleRow = {
  id: string;
  slug: string | null;
  title: string;
  content: unknown;
  featuredImage: string | null;
  metadata: unknown;
  publishedAt: Date;
};

export async function processAllLiveBlogs() {
  const liveBlogs = await prisma.liveBlog.findMany({
    where: { status: "live", aiEditorEnabled: true, deletedAt: null },
  });
  for (const lb of liveBlogs) {
    await processLiveBlog(lb.id);
  }
}

async function processLiveBlog(liveBlogId: string) {
  const liveBlog = await prisma.liveBlog.findUnique({ where: { id: liveBlogId } });
  if (!liveBlog) return;

  const existingArticleIds = await prisma.liveBlogUpdate.findMany({
    where: { liveBlogId, relatedArticleId: { not: null } },
    select: { relatedArticleId: true },
  });
  const skipIds = existingArticleIds.map((u) => u.relatedArticleId).filter(Boolean) as string[];
  const since = new Date(Date.now() - 30 * 60 * 1000);

  let articles: ArticleRow[] = [];
  try {
    articles = await prisma.$queryRawUnsafe<ArticleRow[]>(
      `select "id","slug","title","content","featuredImage","metadata","publishedAt"
       from "Article"
       where "siteId" = $1
         and "status" = 'PUBLISHED'
         and "publishedAt" >= $2
         and "id" <> all($3::text[])
       order by "publishedAt" desc
       limit 30`,
      liveBlog.siteId,
      since,
      skipIds.length > 0 ? skipIds : [""],
    );
  } catch {
    return;
  }

  const matched = articles.filter((a) => matchesTopics(a, liveBlog.aiTopics));
  let createdCount = 0;
  for (const article of matched) {
    const lead = extractLead(article.content);
    if (!lead || lead.length < 100) continue;

    const meta = (article.metadata ?? {}) as Record<string, unknown>;
    const sourceDomain = String(meta.sourceDomain || "");
    const sourceUrl = String(meta.sourceUrl || "");
    const sourceName = SOURCE_NAME_MAP[sourceDomain] || sourceDomain;
    const updateType = classifyType(article);
    const importance = scoreImportance(article, sourceName);

    await prisma.liveBlogUpdate.create({
      data: {
        liveBlogId,
        updateType,
        headline: article.title,
        body: lead,
        importance,
        pinned: importance >= 9,
        authorType: "ai",
        authorName: "AI Live Editor",
        imageUrl: article.featuredImage ?? undefined,
        sourceUrl: sourceUrl || undefined,
        sourceName: sourceName || undefined,
        relatedArticleId: article.id,
        relatedArticleSlug: article.slug ?? undefined,
        status: "published",
      },
    });
    createdCount++;
    console.log(`[live-editor] Added update for "${article.title.substring(0, 60)}..." (importance: ${importance})`);
  }

  if (createdCount > 0) {
    await prisma.liveBlog.update({
      where: { id: liveBlogId },
      data: { updateCount: { increment: createdCount } },
    });
  }
}

function matchesTopics(article: { title: string; content: unknown }, topics: string[]): boolean {
  if (topics.length === 0) return false;
  const title = article.title.toLowerCase();
  const contentSnippet = JSON.stringify(article.content || {}).substring(0, 1500).toLowerCase();
  const text = `${title} ${contentSnippet}`;
  return topics.some((t) => text.includes(t.toLowerCase()));
}

function extractLead(content: unknown): string {
  const blocks = ((content as { content?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }> })?.content ||
    []) as Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
  if (!Array.isArray(blocks)) return "";
  const paragraphs = blocks.filter((b) => b.type === "paragraph").slice(0, 3);
  const texts = paragraphs.map((p) => (p.content || []).filter((c) => c.type === "text").map((c) => c.text || "").join(""));
  let combined = texts.filter(Boolean).join(" ").trim();
  if (combined.length > 500) combined = `${combined.substring(0, 497)}...`;
  return combined;
}

function classifyType(article: { title: string; publishedAt: Date; content: unknown }): string {
  const title = article.title.toLowerCase();
  if (title.match(/^[a-zčćšž][^"]*: |".+"|^[a-zčćšž]\w+: /i)) return "izjava";
  const ageMinutes = (Date.now() - new Date(article.publishedAt).getTime()) / 60000;
  if (
    ageMinutes < 10 &&
    (title.includes("breaking") || title.includes("hitno") || title.includes("proglasen") || title.includes("napad"))
  )
    return "breaking";
  const blockLen = (((article.content as { content?: unknown[] })?.content || []) as unknown[]).length;
  if (blockLen > 15 || title.includes("analiza") || title.includes("zašto")) return "analiza";
  return "update";
}

function scoreImportance(article: { title: string }, sourceName: string): number {
  let score = 5;
  const title = article.title.toLowerCase();
  if (title.includes("breaking") || title.includes("hitno")) score += 3;
  if (title.includes("napad") || title.includes("eksplozija")) score += 2;
  if (title.includes("mrtvi") || title.includes("poginu")) score += 2;
  if (title.includes("proglasen") || title.includes("odluka")) score += 1;
  const tier1 = ["Reuters", "AP", "AFP", "BBC", "Al Jazeera"];
  if (tier1.includes(sourceName)) score += 1;
  if (title.match(/\d+/)) score += 1;
  if (title.match(/"[^"]+"/)) score += 1;
  return Math.max(1, Math.min(10, score));
}
