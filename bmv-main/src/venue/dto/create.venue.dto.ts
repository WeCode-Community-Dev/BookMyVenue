import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { VenueAmenity, VenueCategory } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVenueDto {
  @IsString()
  @MaxLength(100)
  @ApiProperty({example: 'Grand Ballroom'})
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @ApiProperty({example: 'A beautiful ballroom for events'})
  description?: string;

  @IsString()
  @MaxLength(100)
  @ApiProperty({example: 'Kochi'})
  city!: string;

  @IsString()
  @MaxLength(255)
  @ApiProperty({example: '123 Main Street'})
  address!: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({example: 10.0})
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({example: 76.0})
  longitude?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({example: 200})
  capacity?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({example: 5000})
  price?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(VenueCategory, { each: true })
  @ApiProperty({example: ['WEDDING', 'CONFERENCE']})
  categories?: VenueCategory[];

  @IsOptional()
  @IsArray()
  @IsEnum(VenueAmenity, { each: true })
  @ApiProperty({example: ['WI-FI', 'PARKING']})
  amenities?: VenueAmenity[];
}
