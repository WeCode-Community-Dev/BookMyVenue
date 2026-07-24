import { ArrayMinSize, IsArray, IsUUID, ValidateNested } from 'class-validator';

import { BookedSlotDto } from './booked-slot.dto';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsUUID()
  venueId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BookedSlotDto)
  slots!: BookedSlotDto[];
}
