-- CreateTable
CREATE TABLE "space_operating_hours" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "space_operating_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "space_blocked_periods" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,

    CONSTRAINT "space_blocked_periods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "space_operating_hours_spaceId_idx" ON "space_operating_hours"("spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "space_operating_hours_spaceId_weekday_key" ON "space_operating_hours"("spaceId", "weekday");

-- CreateIndex
CREATE INDEX "space_blocked_periods_spaceId_idx" ON "space_blocked_periods"("spaceId");

-- CreateIndex
CREATE INDEX "space_blocked_periods_spaceId_startAt_idx" ON "space_blocked_periods"("spaceId", "startAt");

-- AddForeignKey
ALTER TABLE "space_operating_hours" ADD CONSTRAINT "space_operating_hours_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_blocked_periods" ADD CONSTRAINT "space_blocked_periods_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
