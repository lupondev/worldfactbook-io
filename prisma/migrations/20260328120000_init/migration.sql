-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ciaCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "officialName" TEXT,
    "region" TEXT NOT NULL,
    "subregion" TEXT,
    "flag" TEXT NOT NULL,
    "iso2" TEXT,
    "iso3" TEXT,
    "capital" TEXT,
    "area" DOUBLE PRECISION,
    "population" BIGINT,
    "gdp" DOUBLE PRECISION,
    "gdpPerCapita" DOUBLE PRECISION,
    "gdpGrowth" DOUBLE PRECISION,
    "inflation" DOUBLE PRECISION,
    "unemployment" DOUBLE PRECISION,
    "hdiRank" INTEGER,
    "hdiScore" DOUBLE PRECISION,
    "democracyScore" INTEGER,
    "corruptionIndex" INTEGER,
    "publicDebt" DOUBLE PRECISION,
    "lifeExpectancy" DOUBLE PRECISION,
    "literacyRate" DOUBLE PRECISION,
    "introduction" TEXT,
    "geography" JSONB,
    "peopleAndSociety" JSONB,
    "government" JSONB,
    "economy" JSONB,
    "energy" JSONB,
    "communications" JSONB,
    "transportation" JSONB,
    "military" JSONB,
    "aiSummary" TEXT,
    "aiUpdatedAt" TIMESTAMP(3),
    "dataUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastSync" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "DataSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_slug_key" ON "Country"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Country_ciaCode_key" ON "Country"("ciaCode");
