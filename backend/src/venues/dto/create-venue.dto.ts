import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateVenueDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  capacity?: number;
  
  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  pricePerHour?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  description?: string;
  amenities?: string[];
  featured?: boolean;
}
