-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "address" TEXT,
ADD COLUMN     "amenities" TEXT[],
ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "price" DOUBLE PRECISION;
