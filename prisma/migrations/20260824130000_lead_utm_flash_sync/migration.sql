-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "utmSource" TEXT;
ALTER TABLE "Lead" ADD COLUMN "utmMedium" TEXT;
ALTER TABLE "Lead" ADD COLUMN "utmCampaign" TEXT;
ALTER TABLE "Lead" ADD COLUMN "flashLeadSync" TEXT NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "Lead_flashLeadSync_idx" ON "Lead"("flashLeadSync");
