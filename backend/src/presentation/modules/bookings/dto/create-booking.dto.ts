import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ format: 'uuid' })
  venueId!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  startDate!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  endDate!: Date;

  @ApiProperty({ minimum: 1 })
  guestsCount!: number;
}
