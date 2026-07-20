import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class PredefinedSlotDto {
  @IsString()
  @Matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime must be in HH:MM 24-hour format' })
  startTime: string;

  @IsString()
  @Matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'endTime must be in HH:MM 24-hour format' })
  endTime: string;

  @IsNumber()
  price: number;
}

export class DayAvailabilityDto {
  @IsBoolean()
  isOpen: boolean;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PredefinedSlotDto)
  slots?: PredefinedSlotDto[];
}

export class WeeklyAvailabilityDto {
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  @IsOptional()
  monday?: DayAvailabilityDto;

  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  @IsOptional()
  tuesday?: DayAvailabilityDto;

  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  @IsOptional()
  wednesday?: DayAvailabilityDto;

  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  @IsOptional()
  thursday?: DayAvailabilityDto;

  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  @IsOptional()
  friday?: DayAvailabilityDto;

  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  @IsOptional()
  saturday?: DayAvailabilityDto;

  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  @IsOptional()
  sunday?: DayAvailabilityDto;
}

export class BookingModesDto {
  @IsBoolean()
  @IsOptional()
  fixedSlots?: boolean;

  @IsBoolean()
  @IsOptional()
  hourlyBooking?: boolean;

  @IsBoolean()
  @IsOptional()
  customRequests?: boolean;
}

export class HourlyBookingConfigurationDto {
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsNumber()
  @IsOptional()
  pricePerHour?: number;

  @IsNumber()
  @IsOptional()
  minimumHours?: number;

  @IsNumber()
  @IsOptional()
  maximumHours?: number;
}

export class CustomBookingConfigurationDto {
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsBoolean()
  @IsOptional()
  ownerApprovalRequired?: boolean;

  @IsNumber()
  @IsOptional()
  minimumNoticeHours?: number;
}

export class CreateVenueDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  capacity?: number;
  
  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  pricePerHour?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsOptional()
  featured?: boolean;

  @ValidateNested()
  @Type(() => BookingModesDto)
  @IsOptional()
  bookingModes?: BookingModesDto;

  @ValidateNested()
  @Type(() => HourlyBookingConfigurationDto)
  @IsOptional()
  hourlyBookingConfiguration?: HourlyBookingConfigurationDto;

  @ValidateNested()
  @Type(() => CustomBookingConfigurationDto)
  @IsOptional()
  customBookingConfiguration?: CustomBookingConfigurationDto;

  @ValidateNested()
  @Type(() => WeeklyAvailabilityDto)
  @IsOptional()
  availability?: WeeklyAvailabilityDto;
}
