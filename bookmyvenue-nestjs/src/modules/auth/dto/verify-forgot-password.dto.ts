import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyForgotPasswordOtpDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address associated with the password reset request',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit OTP sent to the user email for verification',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 characters long' })
  otp!: string;
}