import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsEmail } from 'class-validator';

export class VerifyForgotPasswordOtpDto {
  @ApiProperty({
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '482731',
  })
  @IsString()
  @Length(6, 6)
  otp!: string;
}
