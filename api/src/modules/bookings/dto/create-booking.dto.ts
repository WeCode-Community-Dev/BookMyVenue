import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { PricingType } from '../../../../generated/prisma/enums.js';

export function IsAfter(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAfter',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ];

          return new Date(value as string) > new Date(relatedValue as string);
        },
      },
    });
  };
}

export class CreateBookingDto {
  @IsUUID('4')
  spaceId!: string;

  @IsDateString()
  startAt!: string;

  @IsDateString()
  @IsAfter('startAt', {
    message: 'endAt must be after startAt',
  })
  endAt!: string;

  @IsEnum(PricingType)
  pricingType!: PricingType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  guests?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  specialRequest?: string;
}
