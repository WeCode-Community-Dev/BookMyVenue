import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlockType } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class BlockVenueDatesDto {
  @ApiProperty({ example: '2026-08-10T00:00:00.000Z' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2026-08-12T23:59:59.999Z' })
  @IsDateString()
  endDate!: string;

  @ApiPropertyOptional({ enum: BlockType, default: BlockType.FULL_DAY })
  @IsOptional()
  @IsEnum(BlockType)
  blockType?: BlockType;

  @ApiPropertyOptional({ example: 'Private event' })
  @IsOptional()
  @IsString()
  reason?: string;
}
