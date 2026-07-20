import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { WeeklyAvailabilityDto, BookingModesDto, HourlyBookingConfigurationDto, CustomBookingConfigurationDto } from "./create-venue.dto";

export class UpdateVenueDto {
  @IsString()
  @IsOptional()
  name?: string;

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
