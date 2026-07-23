import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class VenueFilterDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    categoryId?: string;

    @IsOptional()
    @IsString()
    amenityIds?: string;
}
