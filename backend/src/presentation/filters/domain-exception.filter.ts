import {
  type ExceptionFilter,
  type ArgumentsHost,
  Catch,
  HttpStatus,
} from '@nestjs/common';
import { type Response } from 'express';
import { NotFoundException } from '../../core/domain/_shared/exception/notfound.exception';
import { BusinessRuleException } from '../../core/domain/_shared/exception/business-rule.exception';
import { DomainException } from '../../core/domain/_shared/exception/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;
    if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof BusinessRuleException) {
      status = HttpStatus.BAD_REQUEST;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }
}
