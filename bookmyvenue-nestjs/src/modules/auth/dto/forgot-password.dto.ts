import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'fathima@example.com',
    description: 'Registered email address used to receive the password reset link or OTP',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}