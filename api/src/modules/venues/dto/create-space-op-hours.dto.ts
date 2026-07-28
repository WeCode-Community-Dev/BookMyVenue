import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';

class CreateSpaceOperatingHourDto {
    @IsInt()
    @Min(0)
    @Max(6)
    weekday!: number;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'openTime must be in HH:mm format',
    })
    openTime!: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'closeTime must be in HH:mm format',
    })
    closeTime!: string;

    @IsOptional()
    @IsBoolean()
    isClosed?: boolean;
}

export class CreateSpaceOperatingHoursDto {
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateSpaceOperatingHourDto)
    hours!: CreateSpaceOperatingHourDto[];
}   