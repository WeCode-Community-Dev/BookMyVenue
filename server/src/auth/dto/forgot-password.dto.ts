import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john@example.com', description: 'Email address for password reset' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
