-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT,
    "projectName" TEXT NOT NULL,
    "projectSlug" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "pageUrl" TEXT,
    "userAgent" TEXT,
    "ipHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "notes" TEXT
);

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_projectSlug_idx" ON "Lead"("projectSlug");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");
