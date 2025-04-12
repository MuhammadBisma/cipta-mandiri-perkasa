-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "browser" TEXT,
    "operatingSystem" TEXT,
    "deviceType" TEXT,
    "country" TEXT,
    "city" TEXT,
    "region" TEXT,
    "firstVisit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastVisit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitCount" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "pageTitle" TEXT,
    "referrer" TEXT,
    "queryParams" TEXT,
    "duration" INTEGER,
    "visitorId" TEXT NOT NULL,
    "blogPostId" TEXT,
    "galleryId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyAnalytics" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "newVisitors" INTEGER NOT NULL DEFAULT 0,
    "returningVisitors" INTEGER NOT NULL DEFAULT 0,
    "avgSessionDuration" INTEGER NOT NULL DEFAULT 0,
    "bounceRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "topPages" JSONB,
    "topCountries" JSONB,
    "topReferrers" JSONB,

    CONSTRAINT "DailyAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visitor_ipAddress_idx" ON "Visitor"("ipAddress");

-- CreateIndex
CREATE INDEX "Visitor_country_idx" ON "Visitor"("country");

-- CreateIndex
CREATE INDEX "Visitor_city_idx" ON "Visitor"("city");

-- CreateIndex
CREATE INDEX "Visitor_firstVisit_idx" ON "Visitor"("firstVisit");

-- CreateIndex
CREATE INDEX "Visitor_lastVisit_idx" ON "Visitor"("lastVisit");

-- CreateIndex
CREATE INDEX "PageView_path_idx" ON "PageView"("path");

-- CreateIndex
CREATE INDEX "PageView_timestamp_idx" ON "PageView"("timestamp");

-- CreateIndex
CREATE INDEX "PageView_visitorId_idx" ON "PageView"("visitorId");

-- CreateIndex
CREATE INDEX "PageView_blogPostId_idx" ON "PageView"("blogPostId");

-- CreateIndex
CREATE INDEX "PageView_galleryId_idx" ON "PageView"("galleryId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyAnalytics_date_key" ON "DailyAnalytics"("date");

-- CreateIndex
CREATE INDEX "DailyAnalytics_date_idx" ON "DailyAnalytics"("date");

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;
