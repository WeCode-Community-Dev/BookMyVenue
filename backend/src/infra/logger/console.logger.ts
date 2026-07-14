import { ConsoleLogger, Injectable } from '@nestjs/common';
import type { ILogger } from 'src/core/application/_shared/logger/ILogger';

@Injectable()
export class NestjsConsoleLogger implements ILogger {
  private readonly logger = new ConsoleLogger();

  // only for nest js internal use
  log(...args: Parameters<ConsoleLogger['log']>): void {
    this.logger.log(...args);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.log(message, meta);
  }

  error(message: string, trace?: string, meta?: Record<string, unknown>): void {
    this.logger.error(message, meta);
    console.log(trace);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, meta);
  }

  verbose(message: string, meta?: Record<string, unknown>): void {
    this.logger.verbose(message, meta);
  }
}
