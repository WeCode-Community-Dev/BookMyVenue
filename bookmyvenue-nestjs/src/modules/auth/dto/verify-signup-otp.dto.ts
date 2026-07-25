import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifySignupOtpDto {
  @ApiProperty({
    example: 'fathima@example.com',
    description: 'Email address used during registration',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit OTP sent to the registered email address',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 characters long' })
  otp!: string;
}