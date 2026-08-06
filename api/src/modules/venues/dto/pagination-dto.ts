import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
    @Transform(({ value }) => (value === undefined || value === null || value === '' ? undefined : Number(value)))
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @Transform(({ value }) => (value === undefined || value === null || value === '' ? undefined : Number(value)))
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;
}