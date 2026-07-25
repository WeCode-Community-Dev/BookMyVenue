import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    example: 'c9b9f9f0-8d3c-4c12-a2b6-6a0f5b123456',
  })
  @IsUUID()
  venueId!: string;

  @ApiProperty({
    example: '2026-08-15T09:00:00.000Z',
  })
  @IsDateString()
  eventStart!: string;

  @ApiProperty({
    example: '2026-08-15T18:00:00.000Z',
  })
  @IsDateString()
  eventEnd!: string;

  @ApiProperty({
    example: 'Wedding Reception',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  eventName!: string;

  @ApiProperty({
    example: 350,
  })
  @IsInt()
  @Min(1)
  guestCount!: number;

  @ApiPropertyOptional({
    example: 'Need stage decoration and projector.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  specialRequests?: string;
}
