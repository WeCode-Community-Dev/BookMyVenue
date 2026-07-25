import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Banquet Hall',
    description: 'Category name shown to users and venue owners',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name!: string;

  @ApiPropertyOptional({
    example: 'Large indoor spaces suitable for weddings, receptions, and events',
    description: 'Optional short description for the category',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}