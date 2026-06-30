import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Amith Biju' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '+9134567890' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/profiles/amith.jpg' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiPropertyOptional({ example: '2005-08-28' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'Male' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ example: 'About me' })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiPropertyOptional({ example: 'amith bhavan ezhukone' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'kollam' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Kerala' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'India' })
  @IsOptional()
  @IsString()
  country?: string;
}
