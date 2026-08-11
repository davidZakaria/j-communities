-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "duplicateOfId" TEXT;
ALTER TABLE "Lead" ADD COLUMN "phoneFingerprint" TEXT;

-- CreateIndex
CREATE INDEX "Lead_phoneFingerprint_projectSlug_idx" ON "Lead"("phoneFingerprint", "projectSlug");
