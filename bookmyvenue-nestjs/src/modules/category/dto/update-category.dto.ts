import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    example: 'Conference Hall',
    description: 'Updated category name shown to users and venue owners',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({
    example: 'Professional venues for meetings, seminars, and workshops',
    description: 'Updated optional description for the category',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}