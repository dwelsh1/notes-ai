-- AlterTable
ALTER TABLE "Page" ADD COLUMN "searchableText" TEXT;

-- CreateIndex
CREATE INDEX "Page_searchableText_idx" ON "Page"("searchableText");
