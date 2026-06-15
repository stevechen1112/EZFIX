-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "apiBaseUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN "apiKey" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN "apiPublishMode" TEXT NOT NULL DEFAULT 'draft';
