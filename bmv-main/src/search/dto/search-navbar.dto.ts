import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchNavbarDto {
  @ApiProperty({
    example: 'Grand Palace, Kochi',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
