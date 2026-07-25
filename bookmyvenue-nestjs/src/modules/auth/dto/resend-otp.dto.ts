import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({
    example: 'fathima@example.com',
    description: 'Email address associated with the pending registration',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}