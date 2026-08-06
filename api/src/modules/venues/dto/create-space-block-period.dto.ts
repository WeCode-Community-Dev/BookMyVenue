import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';
import {
    IsDateString,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateSpaceBlockedPeriodDto {
    @IsDateString()
    startAt!: string;

    @IsDateString()
    @IsAfter('startAt', {
        message: 'endAt must be after startAt',
    })
    endAt!: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    reason?: string;
}



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
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];

                    return new Date(value) > new Date(relatedValue);
                },
            },
        });
    };
}