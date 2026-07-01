-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "bookingNumber" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER,
    "pricingType" "PricingType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "specialRequest" TEXT,
    "ownerNote" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancelledBy" "UserRole",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_bookingNumber_key" ON "bookings"("bookingNumber");

-- CreateIndex
CREATE INDEX "bookings_userId_idx" ON "bookings"("userId");

-- CreateIndex
CREATE INDEX "bookings_venueId_idx" ON "bookings"("venueId");

-- CreateIndex
CREATE INDEX "bookings_spaceId_idx" ON "bookings"("spaceId");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_startAt_idx" ON "bookings"("startAt");

-- CreateIndex
CREATE INDEX "bookings_endAt_idx" ON "bookings"("endAt");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
