import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { EventCategory, VenueType } from '@prisma/client';

import { ArrayNotEmpty } from 'class-validator';
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

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100000)
  capacityMin!: number;

  @Type(() => Number)
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

  @Type(() => Number)
  @IsLatitude()
  latitude!: number;
  @Type(() => Number)
  @IsLongitude()
  longitude!: number;

  // @Transform(({ value }: { value: unknown }) => {
  //   if (typeof value !== 'string') {
  //     return value;
  //   }
  //   try {
  //     return JSON.parse(value) as EventCategory[];
  //   } catch {
  //     return value;
  //   }
  // })
  @IsArray()
  @ArrayUnique()
  @IsEnum(EventCategory, { each: true })
  categories!: EventCategory[];
  // @Transform(({ value }: { value: unknown }) => {
  //   if (typeof value !== 'string') {
  //     return value;
  //   }
  //   try {
  //     return JSON.parse(value) as string[];
  //   } catch {
  //     return value;
  //   }
  // })
  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsString({ each: true })
  amenities!: string[];

  // @Transform(({ value }: { value: unknown }) => {
  //   console.log('RAW SLOT:', value);
  //   if (typeof value !== 'string') {
  //     return value;
  //   }
  //   try {
  //     return JSON.parse(value) as CreateSlotTemplateDto[];
  //   } catch {
  //     return value;
  //   }
  // })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSlotTemplateDto)
  slotTemplates!: CreateSlotTemplateDto[];
}
