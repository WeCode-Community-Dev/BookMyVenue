import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { BookingStatus } from '../../../../generated/prisma/enums.js';

export const BOOKING_SORT_FIELDS = [
  'bookingNumber',
  'startAt',
  'amount',
  'guests',
  'status',
  'createdAt',
] as const;

export type BookingSortField = (typeof BOOKING_SORT_FIELDS)[number];

export class BookingListQueryDto {
  @IsOptional()
  @IsIn(BOOKING_SORT_FIELDS)
  sortBy?: BookingSortField;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsOptional()
  @IsBoolean()
  upcoming?: boolean;

  @Transform(({ value }) =>
    value === undefined || value === null || value === '' ? undefined : Number(value),
  )
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @Transform(({ value }) =>
    value === undefined || value === null || value === '' ? undefined : Number(value),
  )
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
