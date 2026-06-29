import {
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VenueType } from '../../common/enums/venue-type.enum';
import { BookingType } from '../../common/enums/booking-type.enum';

export class CreateVenueDto {
  // ─── Basic Info ──────────────────────────────────────────────────────────

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  venueName: string;

  @IsEnum(VenueType, {
    message: `venueType must be one of: ${Object.values(VenueType).join(', ')}`,
  })
  venueType: VenueType;

  @IsString()
  @IsNotEmpty()
  description: string;

  // ─── Location ────────────────────────────────────────────────────────────

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  district: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  state: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  pincode: string;

  // ─── Capacity ────────────────────────────────────────────────────────────

  @IsInt()
  @Min(1)
  @Type(() => Number)
  maxCapacity: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  squareFeet: number;

  // ─── Parking ─────────────────────────────────────────────────────────────

  @IsBoolean()
  hasParking: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  parkingCapacity?: number;

  // ─── Pricing & Booking ───────────────────────────────────────────────────

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'startingPrice must be a valid price' })
  @Min(0)
  @Type(() => Number)
  startingPrice: number;

  @IsEnum(BookingType, {
    message: `bookingType must be one of: ${Object.values(BookingType).join(', ')}`,
  })
  bookingType: BookingType;
}
