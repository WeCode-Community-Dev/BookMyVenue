/*
  Warnings:

  - You are about to drop the column `airconditioning` on the `venue_amenities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "venue_amenities" DROP COLUMN "airconditioning",
ADD COLUMN     "airConditioning" BOOLEAN NOT NULL DEFAULT false;
