import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateSlotDto {
  @ApiPropertyOptional({
    example: '2026-07-05T11:00:00.000Z',
    description: 'Updated slot start date-time in ISO format',
  })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({
    example: '2026-07-05T13:00:00.000Z',
    description: 'Updated slot end date-time in ISO format',
  })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({
    example: 5500,
    description: 'Updated booking price for this slot',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price?: number;
}