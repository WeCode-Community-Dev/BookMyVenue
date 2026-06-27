import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateVenueDto {
  @ApiProperty({
    example: 'Emerald Banquet Hall',
    description: 'Venue name shown to users',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({
    example: 'Spacious indoor venue suitable for weddings and receptions',
    description: 'Optional venue description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    example: 'Calicut',
    description: 'Primary venue location or city',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  location!: string;

  @ApiPropertyOptional({
    example: 'Beach Road, Kozhikode, Kerala',
    description: 'Detailed venue address',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiProperty({
    example: 2500,
    description: 'Hourly rental price for the venue',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  pricePerHour!: number;

  @ApiProperty({
    example: 300,
    description: 'Maximum number of people the venue can hold',
  })
  @IsInt()
  @Min(1)
  capacity!: number;

  @ApiPropertyOptional({
    example: [
      'https://example.com/images/emerald-1.jpg',
      'https://example.com/images/emerald-2.jpg',
    ],
    description: 'Optional list of public image URLs for the venue',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsUrl({}, { each: true })
  imageUrls?: string[];

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Listed category ID selected for this venue',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;
}