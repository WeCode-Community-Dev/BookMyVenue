-- AlterTable
ALTER TABLE "venues" ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[];
