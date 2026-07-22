import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  VenueAmenity,
  VenueCategory,
  VenueDocumentType,
} from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateVenueDocumentDto {
  @IsEnum(VenueDocumentType)
  @ApiProperty({ example: 'GOVERNMENT_ID', enum: VenueDocumentType })
  type!: VenueDocumentType;

  @IsString()
  @MaxLength(500)
  @ApiProperty({ example: '/uploads/venues/venue-doc-123.pdf' })
  documentUrl!: string;
}

export class CreateVenueDto {
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'Grand Ballroom' })
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @ApiPropertyOptional({ example: 'A beautiful ballroom for events' })
  description?: string;

  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'Kochi' })
  city!: string;

  @IsString()
  @MaxLength(255)
  @ApiProperty({ example: '123 Main Street' })
  address!: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 10.0 })
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 76.0 })
  longitude?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 200 })
  capacity?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 5000 })
  price?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(VenueCategory, { each: true })
  @ApiPropertyOptional({ example: ['WEDDING', 'CONFERENCE'] })
  categories?: VenueCategory[];

  @IsOptional()
  @IsArray()
  @IsEnum(VenueAmenity, { each: true })
  @ApiPropertyOptional({ example: ['WIFI', 'PARKING'] })
  amenities?: VenueAmenity[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ example: ['/uploads/venue/cover.jpg'] })
  imageUrls?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVenueDocumentDto)
  @ApiPropertyOptional({ type: [CreateVenueDocumentDto] })
  documents?: CreateVenueDocumentDto[];
}
