/*
  Warnings:

  - Added the required column `city` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VenueStatus" AS ENUM ('PENDING_DOCUMENTS', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VenueCategory" AS ENUM ('WEDDING', 'BIRTHDAY', 'CONFERENCE', 'SPORTS', 'PARTY', 'AUDITORIUM', 'RESORT', 'MEETING', 'OTHER');

-- CreateEnum
CREATE TYPE "VenueAmenity" AS ENUM ('WIFI', 'PARKING', 'AIR_CONDITIONING', 'CATERING', 'RESTROOM', 'SOUND_SYSTEM', 'PROJECTOR', 'STAGE', 'GENERATOR', 'OTHER');

-- CreateEnum
CREATE TYPE "VenueDocumentType" AS ENUM ('GOVERNMENT_ID', 'PROPERTY_DOCUMENT');

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "amenities" "VenueAmenity"[],
ADD COLUMN     "categories" "VenueCategory"[],
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" "VenueStatus" NOT NULL DEFAULT 'PENDING_DOCUMENTS',
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;

-- CreateTable
CREATE TABLE "VenueDocument" (
    "id" TEXT NOT NULL,
    "type" "VenueDocumentType" NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VenueDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VenueDocument" ADD CONSTRAINT "VenueDocument_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
