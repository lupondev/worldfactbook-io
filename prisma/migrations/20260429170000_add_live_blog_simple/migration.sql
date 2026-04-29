CREATE TABLE "live_blogs" (
  "id" TEXT NOT NULL,
  "siteId" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "description" TEXT NOT NULL,
  "templateType" TEXT NOT NULL DEFAULT 'generic',
  "status" TEXT NOT NULL DEFAULT 'draft',
  "startedAt" TIMESTAMP(3),
  "endedAt" TIMESTAMP(3),
  "heroImage" TEXT,
  "aiEditorEnabled" BOOLEAN NOT NULL DEFAULT true,
  "aiTopics" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "viewerCount" INTEGER NOT NULL DEFAULT 0,
  "updateCount" INTEGER NOT NULL DEFAULT 0,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "live_blogs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "live_blogs_slug_key" ON "live_blogs"("slug");
CREATE INDEX "live_blogs_siteId_status_startedAt_idx" ON "live_blogs"("siteId", "status", "startedAt" DESC);
CREATE INDEX "live_blogs_slug_idx" ON "live_blogs"("slug");

CREATE TABLE "live_blog_updates" (
  "id" TEXT NOT NULL,
  "liveBlogId" TEXT NOT NULL,
  "updateType" TEXT NOT NULL,
  "headline" TEXT,
  "body" TEXT NOT NULL,
  "pinned" BOOLEAN NOT NULL DEFAULT false,
  "importance" INTEGER NOT NULL DEFAULT 5,
  "authorType" TEXT NOT NULL DEFAULT 'ai',
  "authorName" TEXT,
  "imageUrl" TEXT,
  "imageCaption" TEXT,
  "embedHtml" TEXT,
  "embedType" TEXT,
  "sourceUrl" TEXT,
  "sourceName" TEXT,
  "relatedArticleId" TEXT,
  "relatedArticleSlug" TEXT,
  "status" TEXT NOT NULL DEFAULT 'published',
  "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "live_blog_updates_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "live_blog_updates_liveBlogId_publishedAt_idx" ON "live_blog_updates"("liveBlogId", "publishedAt" DESC);
CREATE INDEX "live_blog_updates_liveBlogId_pinned_publishedAt_idx" ON "live_blog_updates"("liveBlogId", "pinned", "publishedAt" DESC);
CREATE INDEX "live_blog_updates_relatedArticleId_idx" ON "live_blog_updates"("relatedArticleId");

CREATE TABLE "live_blog_reactions" (
  "id" TEXT NOT NULL,
  "liveBlogId" TEXT NOT NULL,
  "updateId" TEXT,
  "emoji" TEXT NOT NULL,
  "ipHash" TEXT,
  "sessionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "live_blog_reactions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "live_blog_reactions_updateId_emoji_ipHash_key" ON "live_blog_reactions"("updateId", "emoji", "ipHash");
CREATE INDEX "live_blog_reactions_liveBlogId_emoji_idx" ON "live_blog_reactions"("liveBlogId", "emoji");

ALTER TABLE "live_blog_updates"
ADD CONSTRAINT "live_blog_updates_liveBlogId_fkey" FOREIGN KEY ("liveBlogId") REFERENCES "live_blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "live_blog_reactions"
ADD CONSTRAINT "live_blog_reactions_liveBlogId_fkey" FOREIGN KEY ("liveBlogId") REFERENCES "live_blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "live_blog_reactions"
ADD CONSTRAINT "live_blog_reactions_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "live_blog_updates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
