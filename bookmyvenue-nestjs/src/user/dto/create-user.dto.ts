import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsEnum(Role,
    {
        message: "USER or OWNER", 
    }
  )
  @IsOptional()
  role?: Role;
}