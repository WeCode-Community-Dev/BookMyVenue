import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'AMITH ', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: '123 Main St, City, State 12345', required: false })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg', required: false })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}
