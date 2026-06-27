import {
  INestApplication,
  RawBodyRequest,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import morgan = require('morgan');
import cookieParser = require('cookie-parser');
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '../../app.module';
import { setupSwagger } from './swagger.config';

export async function setupApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.use(
    bodyParser.json({
      limit: '50mb',
      verify: (req: RawBodyRequest<Request>, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.use(morgan('dev'));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  setupSwagger(app);

  return app;
}