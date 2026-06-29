import { Index } from "typeorm";
import { IsString, IsNotEmpty, IsOptional, Matches, MaxLength } from 'class-validator';

export class CreateVenueBlockedDateRangeDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'startDate must be in YYYY-MM-DD format',
    })
    startDate: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'endDate must be in YYYY-MM-DD format',
    })
    endDate: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    reason?: string;
}
