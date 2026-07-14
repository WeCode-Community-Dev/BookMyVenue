/*
  Warnings:

  - You are about to drop the `amenities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `venue_amenities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "venue_amenities" DROP CONSTRAINT "venue_amenities_amenity_id_fkey";

-- DropForeignKey
ALTER TABLE "venue_amenities" DROP CONSTRAINT "venue_amenities_venue_id_fkey";

-- DropTable
DROP TABLE "amenities";

-- DropTable
DROP TABLE "venue_amenities";
