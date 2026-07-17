import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsUUID()
  @ApiProperty({example: 'c9b9f9f0-8d3c-4c12-a2b6-6a0f5b123456'})
  bookingId!: string;
}
