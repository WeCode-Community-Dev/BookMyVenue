import {
  type PipeTransform,
  type ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { type ZodObject, type ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
