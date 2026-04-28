-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL,
    "articleId" TEXT,
    "slug" TEXT,
    "title" TEXT,
    "trustStatus" TEXT NOT NULL DEFAULT 'ai_generated',
    "impactScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aiConfidence" DOUBLE PRECISION,
    "editorValidated" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "needsDiffReview" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleSignals" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "clusterScore" DOUBLE PRECISION,
    "embeddingKey" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleSignals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionAuditLog" (
    "id" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "actorLabel" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecisionAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Decision_trustStatus_idx" ON "Decision"("trustStatus");

-- CreateIndex
CREATE INDEX "Decision_impactScore_idx" ON "Decision"("impactScore" DESC);

-- CreateIndex
CREATE INDEX "Decision_version_idx" ON "Decision"("version");

-- CreateIndex
CREATE INDEX "Decision_needsDiffReview_idx" ON "Decision"("needsDiffReview");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleSignals_decisionId_key" ON "ArticleSignals"("decisionId");

-- CreateIndex
CREATE INDEX "DecisionAuditLog_decisionId_idx" ON "DecisionAuditLog"("decisionId");

-- CreateIndex
CREATE INDEX "DecisionAuditLog_action_idx" ON "DecisionAuditLog"("action");

-- CreateIndex
CREATE INDEX "DecisionAuditLog_actor_idx" ON "DecisionAuditLog"("actor");

-- CreateIndex
CREATE INDEX "DecisionAuditLog_createdAt_idx" ON "DecisionAuditLog"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "ArticleSignals" ADD CONSTRAINT "ArticleSignals_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionAuditLog" ADD CONSTRAINT "DecisionAuditLog_decisionId_fkey" FOREIGN KEY ("decisionId") REFERENCES "Decision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
