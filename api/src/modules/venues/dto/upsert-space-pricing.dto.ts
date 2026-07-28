import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { PricingType } from '../../../../generated/prisma/enums.js';

function IsGreaterThanOrEqual(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThanOrEqual',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyName];

          if (value === undefined || value === null) {
            return true;
          }
          if (relatedValue === undefined || relatedValue === null) {
            return true;
          }

          return Number(value) >= Number(relatedValue);
        },
      },
    });
  };
}

export class UpsertSpacePricingDto {
  @IsEnum(PricingType)
  pricingType!: PricingType;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  currency!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minBooking?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsGreaterThanOrEqual('minBooking', {
    message: 'maxBooking must be greater than or equal to minBooking',
  })
  maxBooking?: number;
}
