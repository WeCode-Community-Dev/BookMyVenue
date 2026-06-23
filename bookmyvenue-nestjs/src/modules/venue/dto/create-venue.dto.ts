import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateVenueDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  pricePerHour!: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsNumber()
  @IsOptional()
  cancellationWindowDays?: number;
}