import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { EventCategory, VenueType } from '@prisma/client';

import { CreateSlotTemplateDto } from './create-slot-template.dto';
import { Type } from 'class-transformer';

export class CreateVenueDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  description!: string;

  @IsEnum(VenueType)
  venueType!: VenueType;

  @IsInt()
  @Min(1)
  @Max(100000)
  capacityMin!: number;

  @IsInt()
  @Min(1)
  @Max(100000)
  capacityMax!: number;

  @IsString()
  @IsNotEmpty()
  addressLine!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;

  @IsArray()
  @ArrayUnique()
  @IsEnum(EventCategory, { each: true })
  categories!: EventCategory[];

  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  amenityIds!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSlotTemplateDto)
  slotTemplates!: CreateSlotTemplateDto[];
}
