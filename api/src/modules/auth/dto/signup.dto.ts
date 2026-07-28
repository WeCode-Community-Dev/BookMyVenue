import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../../../../generated/prisma/enums.js';
import {
  normalizeEmail,
  trimOptionalString,
  trimString,
} from '../helpers/transforms.js';

export class SignupDto {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @Transform(trimOptionalString)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @Transform(normalizeEmail)
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @Transform(trimString)
  @IsString()
  @IsIn([UserRole.CUSTOMER, UserRole.VENUE_OWNER])
  role!: typeof UserRole.CUSTOMER | typeof UserRole.VENUE_OWNER;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @IsPhoneNumber('IN')
  phone!: string;
}
