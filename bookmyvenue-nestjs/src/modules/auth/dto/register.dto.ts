import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum, MinLength, MaxLength, Matches } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password!: string;

  @IsEnum([Role.USER, Role.OWNER],
    {
      message: "USER or OWNER",
    }
  )
  @IsOptional()
  role?: Role;
}