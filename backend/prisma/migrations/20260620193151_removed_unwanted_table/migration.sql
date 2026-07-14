/*
  Warnings:

  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `refunds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `saved_venues` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "refunds" DROP CONSTRAINT "refunds_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_venue_id_fkey";

-- DropForeignKey
ALTER TABLE "saved_venues" DROP CONSTRAINT "saved_venues_user_id_fkey";

-- DropForeignKey
ALTER TABLE "saved_venues" DROP CONSTRAINT "saved_venues_venue_id_fkey";

-- DropTable
DROP TABLE "audit_logs";

-- DropTable
DROP TABLE "refunds";

-- DropTable
DROP TABLE "reviews";

-- DropTable
DROP TABLE "saved_venues";

-- DropEnum
DROP TYPE "refund_status";
