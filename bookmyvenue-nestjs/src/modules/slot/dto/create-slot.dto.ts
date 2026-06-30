import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { RepeatType } from '../enums/repeat-type.enum';

export class CreateSlotDto {
  @ApiProperty({
    example: '2026-07-01T10:00:00.000Z',
    description: 'First slot start date-time in ISO format',
  })
  @IsDateString()
  @IsNotEmpty()
  startTime!: string;

  @ApiProperty({
    example: '2026-07-01T12:00:00.000Z',
    description: 'First slot end date-time in ISO format',
  })
  @IsDateString()
  @IsNotEmpty()
  endTime!: string;

  @ApiProperty({
    example: 5000,
    description: 'Booking price for this slot',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price!: number;

  @ApiPropertyOptional({
    example: RepeatType.WEEKLY,
    enum: RepeatType,
    description: 'Repeat rule for generating recurring slots',
  })
  @IsOptional()
  @IsEnum(RepeatType)
  repeatType?: RepeatType;

  @ApiPropertyOptional({
    example: '2026-08-31T12:00:00.000Z',
    description: 'Last allowed occurrence end date-time for recurring slot creation',
  })
  @IsOptional()
  @IsDateString()
  repeatUntil?: string;
}