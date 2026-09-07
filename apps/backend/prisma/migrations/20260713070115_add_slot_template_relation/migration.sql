/*
  Warnings:

  - A unique constraint covering the columns `[slotTemplateId,eventDate]` on the table `BookedSlot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slotTemplateId` to the `BookedSlot` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BookedSlot_slotPricingTierId_eventDate_idx";

-- AlterTable
ALTER TABLE "BookedSlot" ADD COLUMN     "slotTemplateId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BookedSlot_slotTemplateId_eventDate_key" ON "BookedSlot"("slotTemplateId", "eventDate");

-- AddForeignKey
ALTER TABLE "BookedSlot" ADD CONSTRAINT "BookedSlot_slotTemplateId_fkey" FOREIGN KEY ("slotTemplateId") REFERENCES "VenueSlotTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
