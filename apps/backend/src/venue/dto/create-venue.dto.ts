import {
    IsArray,
    ArrayMinSize,
    IsEnum,
    IsInt,
    IsLatitude,
    IsLongitude,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min,
    MinLength,
    IsBoolean,
} from 'class-validator';

import { VenueType, EventCategory, VenueStatus } from '@prisma/client';

export class CreateVenueDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @IsString()
    @MinLength(20)
    @MaxLength(2000)
    description: string;

    @IsEnum(VenueType)
    venueType: VenueType;

    @IsArray()
    @ArrayMinSize(1)
    @IsEnum(EventCategory,{each:true})
    categories: EventCategory[];

    @IsInt()
    @Min(1)
    capacityMin: number;

    @IsInt()
    @Min(1)
    capacityMax: number;

    @IsString()
    addressLine: string;

    @IsString()
    city: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsLatitude()
    latitude: number;

    @IsLongitude()
    longitude: number;

    @IsOptional()
    @IsArray()
    @IsUUID('4', {
        each: true,
    })
    amenityIds?: string[];

    @IsString()
    status: VenueStatus;

    @IsArray()
    @ArrayMinSize(1)
    @IsEnum(EventCategory, {
        each: true,
    })

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

};