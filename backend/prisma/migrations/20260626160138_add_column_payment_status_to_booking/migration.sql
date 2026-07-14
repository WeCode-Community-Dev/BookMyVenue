-- AlterEnum
ALTER TYPE "payment_status" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "payment_status" "payment_status" NOT NULL DEFAULT 'PENDING';
