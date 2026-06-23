import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  venueId!: string;

  @IsDateString()
  @IsNotEmpty()
  startTime!: string;

  @IsDateString()
  @IsNotEmpty()
  endTime!: string;
}