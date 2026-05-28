import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { VenueType } from '../entities/venue.entity';

export class CreateVenueDto {
  @ApiProperty({ example: 'Grand Celebration Hall', description: 'Name of the venue' })
  @IsString()
  @IsNotEmpty()
  venueName: string;

  @ApiProperty({ enum: VenueType, example: VenueType.BANQUET_HALL, description: 'Type of venue' })
  @IsEnum(VenueType)
  venueType: VenueType;

  @ApiPropertyOptional({ example: 'A beautiful hall for all your celebrations', description: 'Venue description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '123 Main St, Chennai, Tamil Nadu', description: 'Full address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 13.0827, description: 'Latitude (-90 to 90)' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 80.2707, description: 'Longitude (-180 to 180)' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ example: 200, description: 'Maximum seating capacity', minimum: 1 })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: 1500, description: 'Price per hour in INR', minimum: 0 })
  @IsNumber()
  @Min(0)
  pricePerHour: number;

  @ApiPropertyOptional({
    example: ['WiFi', 'Parking', 'AC', 'Projector'],
    description: 'List of amenities',
    type: [String],
  })
  @IsArray()
  @IsOptional()
  amenities?: string[];

  @ApiPropertyOptional({
    example: ['https://example.com/image1.jpg'],
    description: 'List of image URLs',
    type: [String],
  })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ example: '09:00', description: 'Opening time (HH:mm)' })
  @IsString()
  @IsOptional()
  openingTime?: string;

  @ApiPropertyOptional({ example: '22:00', description: 'Closing time (HH:mm)' })
  @IsString()
  @IsOptional()
  closingTime?: string;
}
