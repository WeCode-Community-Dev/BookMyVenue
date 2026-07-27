import { Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

const trimString = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

const trimOptionalString = ({ value }: { value: unknown }): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const toUuidArray = ({ value }: { value: unknown }): string[] => {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    return value as string[];
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

export class CreateVenueDto {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  address: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @Transform(({ value }) => (value === undefined || value === null ? undefined : Number(value)))
  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @Transform(({ value }) => (value === undefined || value === null ? undefined : Number(value)))
  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  timezone: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  coverImageId?: string;


  @Transform(toUuidArray)
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  venueAmenityIds: string[] = [];

  @Transform(toUuidArray)
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  venueImageIds: string[] = [];
}
