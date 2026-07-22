import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ReviewOwnerBookingDto {
  @ApiPropertyOptional({ example: 'Date unavailable after manual review.' })
  @IsOptional()
  @IsString()
  reason?: string;
}
