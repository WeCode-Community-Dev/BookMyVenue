import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: '9e70ac35-24c5-4d8f-bc00-fca42148fe70',
    description: 'Unique ID of the slot the user wants to book',
  })
  @IsUUID()
  @IsNotEmpty()
  slotId!: string;
}