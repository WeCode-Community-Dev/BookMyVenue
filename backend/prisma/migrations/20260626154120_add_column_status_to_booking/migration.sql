/*
  Warnings:

  - The values [PENDING] on the enum `payment_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "booking_status" AS ENUM ('BOOKED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "payment_status_new" AS ENUM ('INITIATED', 'PAID', 'FAILED', 'REFUNDED');
ALTER TABLE "public"."payments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "payments" ALTER COLUMN "status" TYPE "payment_status_new" USING ("status"::text::"payment_status_new");
ALTER TYPE "payment_status" RENAME TO "payment_status_old";
ALTER TYPE "payment_status_new" RENAME TO "payment_status";
DROP TYPE "public"."payment_status_old";
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'INITIATED';
COMMIT;

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "status" "booking_status" NOT NULL DEFAULT 'BOOKED';

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'INITIATED';
