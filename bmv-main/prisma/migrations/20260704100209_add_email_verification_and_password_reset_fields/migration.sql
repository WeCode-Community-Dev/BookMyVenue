-- AlterTable
ALTER TABLE "User" ADD COLUMN     "forgotPasswordOtp" TIMESTAMP(3),
ADD COLUMN     "forgotPasswordOtpExpiry" TEXT;
