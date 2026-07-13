import { IsUUID } from 'class-validator';

export class CancelBookingDto {
  @IsUUID()
  bookingId!: string;
}
