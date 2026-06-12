
import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodObject, type ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodObject) { }

    transform(value: unknown, metadata: ArgumentMetadata) {
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}

