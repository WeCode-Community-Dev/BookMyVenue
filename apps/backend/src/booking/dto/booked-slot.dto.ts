import { IsDateString, IsUUID } from 'class-validator';

export class BookedSlotDto {
  @IsUUID()
  slotPricingTierId!: string;

  @IsDateString()
  eventDate!: string;
}
