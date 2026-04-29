CREATE TABLE "ingest_logs" (
  "id" TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "sourceDomain" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ingest_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ingest_logs_sourceDomain_action_createdAt_idx"
  ON "ingest_logs"("sourceDomain", "action", "createdAt");
