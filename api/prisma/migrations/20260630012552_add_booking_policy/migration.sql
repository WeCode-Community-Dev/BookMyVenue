-- CreateEnum
CREATE TYPE "BookingPolicy" AS ENUM ('INSTANT_ONLY', 'REQUEST_ONLY', 'BOTH');

-- AlterTable
ALTER TABLE "spaces" ADD COLUMN     "bookingPolicy" "BookingPolicy" NOT NULL DEFAULT 'INSTANT_ONLY';
