-- Align Decision with Prisma schema (OHR / pipeline fields introduced after trust base table).

ALTER TABLE "Decision" ADD COLUMN IF NOT EXISTS "source" TEXT NOT NULL DEFAULT 'OHR';

ALTER TABLE "Decision" ADD COLUMN IF NOT EXISTS "sourceCaseId" TEXT;

ALTER TABLE "Decision" ADD COLUMN IF NOT EXISTS "defendant" TEXT;

ALTER TABLE "Decision" ADD COLUMN IF NOT EXISTS "decisionDate" TIMESTAMP(3);

ALTER TABLE "Decision" ADD COLUMN IF NOT EXISTS "decisionType" TEXT;

ALTER TABLE "Decision" ADD COLUMN IF NOT EXISTS "pdfUrl" TEXT;

ALTER TABLE "Decision" ADD COLUMN IF NOT EXISTS "pdfHash" TEXT;

ALTER TABLE "Decision" ADD COLUMN IF NOT EXISTS "pdfBlobUrl" TEXT;

ALTER TABLE "Decision" ADD COLUMN IF NOT EXISTS "pageCount" INTEGER;

ALTER TABLE "Decision" ADD COLUMN IF NOT EXISTS "extractDeferred" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "Decision_source_idx" ON "Decision"("source");

CREATE INDEX IF NOT EXISTS "Decision_sourceCaseId_idx" ON "Decision"("sourceCaseId");

CREATE INDEX IF NOT EXISTS "Decision_decisionDate_idx" ON "Decision"("decisionDate");
