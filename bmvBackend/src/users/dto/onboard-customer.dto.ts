import { IsNotEmpty, IsOptional, IsString, Length, IsUrl } from 'class-validator';

export class OnboardCustomerDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  addressLine1: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  addressLine2?: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  city: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  state: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  pincode: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'googleLocationUrl must be a valid URL' })
  googleLocationUrl?: string;
}
