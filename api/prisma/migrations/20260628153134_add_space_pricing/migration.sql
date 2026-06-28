-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('HOURLY', 'SESSION', 'DAILY', 'EVENT', 'CUSTOM');

-- CreateTable
CREATE TABLE "space_pricing" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "pricingType" "PricingType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "minBooking" INTEGER,
    "maxBooking" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "space_pricing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "space_pricing" ADD CONSTRAINT "space_pricing_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
