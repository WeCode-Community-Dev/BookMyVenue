-- CreateTable
CREATE TABLE "VenueSlot" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VenueSlot_venueId_startTime_endTime_idx" ON "VenueSlot"("venueId", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "VenueSlot_venueId_isActive_idx" ON "VenueSlot"("venueId", "isActive");

-- AddForeignKey
ALTER TABLE "VenueSlot" ADD CONSTRAINT "VenueSlot_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
