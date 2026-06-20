-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerifyExpiry" TIMESTAMP(3),
ADD COLUMN     "emailVerifyOtp" TEXT;
