import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '../schemas/booking.schema';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus, {
    message: `Status must be a valid BookingStatus value: ${Object.values(BookingStatus).join(', ')}`,
  })
  status: string;

  @IsString()
  @IsOptional()
  cancellationReason?: string;

  @IsNumber()
  @IsOptional()
  totalPrice?: number;
}
