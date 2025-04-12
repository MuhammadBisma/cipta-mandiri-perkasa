/*
  Warnings:

  - Made the column `topPages` on table `DailyAnalytics` required. This step will fail if there are existing NULL values in that column.
  - Made the column `topCountries` on table `DailyAnalytics` required. This step will fail if there are existing NULL values in that column.
  - Made the column `topReferrers` on table `DailyAnalytics` required. This step will fail if there are existing NULL values in that column.
  - Made the column `browser` on table `Visitor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `operatingSystem` on table `Visitor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deviceType` on table `Visitor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Visitor_firstVisit_idx";

-- DropIndex
DROP INDEX "Visitor_lastVisit_idx";

-- AlterTable
ALTER TABLE "DailyAnalytics" ALTER COLUMN "pageViews" DROP DEFAULT,
ALTER COLUMN "uniqueVisitors" DROP DEFAULT,
ALTER COLUMN "newVisitors" DROP DEFAULT,
ALTER COLUMN "returningVisitors" DROP DEFAULT,
ALTER COLUMN "avgSessionDuration" DROP DEFAULT,
ALTER COLUMN "bounceRate" DROP DEFAULT,
ALTER COLUMN "topPages" SET NOT NULL,
ALTER COLUMN "topPages" SET DATA TYPE TEXT,
ALTER COLUMN "topCountries" SET NOT NULL,
ALTER COLUMN "topCountries" SET DATA TYPE TEXT,
ALTER COLUMN "topReferrers" SET NOT NULL,
ALTER COLUMN "topReferrers" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Visitor" ALTER COLUMN "browser" SET NOT NULL,
ALTER COLUMN "operatingSystem" SET NOT NULL,
ALTER COLUMN "deviceType" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Visitor_deviceType_idx" ON "Visitor"("deviceType");

-- CreateIndex
CREATE INDEX "Visitor_browser_idx" ON "Visitor"("browser");
