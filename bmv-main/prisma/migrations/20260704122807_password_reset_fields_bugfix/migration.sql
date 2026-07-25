/*
  Warnings:

  - The `forgotPasswordOtpExpiry` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "forgotPasswordOtp" SET DATA TYPE TEXT,
DROP COLUMN "forgotPasswordOtpExpiry",
ADD COLUMN     "forgotPasswordOtpExpiry" TIMESTAMP(3);
