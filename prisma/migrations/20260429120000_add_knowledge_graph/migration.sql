DROP TABLE IF EXISTS "EntityRelation" CASCADE;

DROP TABLE IF EXISTS "EntityArticle" CASCADE;

DROP TABLE IF EXISTS "EntityDecision" CASCADE;

DROP TABLE IF EXISTS "Entity" CASCADE;

CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameBs" TEXT NOT NULL,
    "nameEn" TEXT,
    "shortBio" TEXT,
    "imageUrl" TEXT,
    "metadata" JSONB,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Relation" (
    "id" TEXT NOT NULL,
    "fromEntityId" TEXT NOT NULL,
    "toEntityId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "since" TIMESTAMP(3),
    "evidenceUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Relation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EntityDecision" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "decisionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "context" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntityDecision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EntityArticle" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntityArticle_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Entity_slug_key" ON "Entity"("slug");

CREATE INDEX "Entity_type_isVerified_idx" ON "Entity"("type", "isVerified");

CREATE INDEX "Entity_slug_idx" ON "Entity"("slug");

CREATE UNIQUE INDEX "Relation_fromEntityId_toEntityId_type_key" ON "Relation"("fromEntityId", "toEntityId", "type");

CREATE INDEX "EntityDecision_decisionId_idx" ON "EntityDecision"("decisionId");

CREATE UNIQUE INDEX "EntityDecision_entityId_decisionId_key" ON "EntityDecision"("entityId", "decisionId");

CREATE INDEX "EntityArticle_articleId_idx" ON "EntityArticle"("articleId");

CREATE UNIQUE INDEX "EntityArticle_entityId_articleId_key" ON "EntityArticle"("entityId", "articleId");

ALTER TABLE "Relation" ADD CONSTRAINT "Relation_fromEntityId_fkey" FOREIGN KEY ("fromEntityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Relation" ADD CONSTRAINT "Relation_toEntityId_fkey" FOREIGN KEY ("toEntityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "EntityDecision_entityId_idx" ON "EntityDecision"("entityId");

CREATE INDEX "EntityArticle_entityId_idx" ON "EntityArticle"("entityId");

ALTER TABLE "EntityDecision" ADD CONSTRAINT "EntityDecision_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EntityArticle" ADD CONSTRAINT "EntityArticle_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
