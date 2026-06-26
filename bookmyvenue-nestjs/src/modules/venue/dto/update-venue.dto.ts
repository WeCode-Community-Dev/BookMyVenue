import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateVenueDto {
  @ApiPropertyOptional({
    example: 'Emerald Premium Banquet Hall',
    description: 'Updated venue name',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'Renovated premium hall for weddings, events, and conferences',
    description: 'Updated venue description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    example: 'Kochi',
    description: 'Updated venue location or city',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @ApiPropertyOptional({
    example: 'MG Road, Kochi, Kerala',
    description: 'Updated detailed venue address',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({
    example: 3000,
    description: 'Updated hourly rental price',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  pricePerHour?: number;

  @ApiPropertyOptional({
    example: 350,
    description: 'Updated maximum venue capacity',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({
    example: [
      'https://example.com/images/emerald-premium-1.jpg',
      'https://example.com/images/emerald-premium-2.jpg',
    ],
    description: 'Updated list of public image URLs for the venue',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsUrl({}, { each: true })
  imageUrls?: string[];

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440111',
    description: 'Updated listed category ID for this venue',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}