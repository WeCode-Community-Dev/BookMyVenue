import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'uuid-of-venue', description: 'ID of the venue to book' })
  @IsString()
  @IsNotEmpty()
  venueId: string;

  @ApiProperty({ example: '2025-06-15', description: 'Booking date (YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty()
  bookingDate: string;

  @ApiPropertyOptional({ example: '2025-06-16', description: 'Booking end date (YYYY-MM-DD)' })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: '10:00', description: 'Start time (HH:mm)' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '14:00', description: 'End time (HH:mm)' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiPropertyOptional({ example: 50, description: 'Number of guests', minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  guestCount?: number;

  @ApiPropertyOptional({ example: 'uuid-of-lock', description: 'ID of the acquired booking lock' })
  @IsString()
  @IsOptional()
  lockId?: string;

  @ApiPropertyOptional({ example: 'Wedding Reception', description: 'Purpose of booking' })
  @IsString()
  @IsOptional()
  purpose?: string;
}
