import { IsEmail } from 'class-validator';

export class RequestOtpDto {
  @IsEmail()
  email!: string;
}
