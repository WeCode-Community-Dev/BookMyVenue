/*
  Warnings:

  - You are about to drop the column `currency` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `ownerEmail` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `ownerName` on the `Venue` table. All the data in the column will be lost.
  - You are about to drop the column `ownerPhone` on the `Venue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Venue" DROP COLUMN "currency",
DROP COLUMN "location",
DROP COLUMN "ownerEmail",
DROP COLUMN "ownerName",
DROP COLUMN "ownerPhone";
