import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CreateSlotPricingDto } from './create-slot-pricing.dto';
import { Type } from 'class-transformer';

export class CreateSlotTemplateDto {
  @IsString()
  label!: string;

  @IsInt()
  startDayOffset!: number;

  @IsString()
  startTime!: string;

  @IsInt()
  endDayOffset!: number;

  @IsString()
  endTime!: string;

  @IsBoolean()
  isCustom!: boolean;

  @IsOptional()
  @IsNumber()
  customRatePerGuestPerHour?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSlotPricingDto)
  pricingTiers!: CreateSlotPricingDto[];
}
