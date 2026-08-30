-- CreateTable
CREATE TABLE "Callback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "comment" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notifiedAt" DATETIME,
    "handled" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE INDEX "Callback_createdAt_idx" ON "Callback"("createdAt");
