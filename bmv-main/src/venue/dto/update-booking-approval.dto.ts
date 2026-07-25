import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateBookingApprovalDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  bookingApprovalRequired!: boolean;
}
