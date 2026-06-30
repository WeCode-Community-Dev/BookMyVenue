/*
  Warnings:

  - You are about to drop the column `billingAddress` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "billingAddress",
DROP COLUMN "name",
DROP COLUMN "profilePicture",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "biography" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "state" TEXT;
