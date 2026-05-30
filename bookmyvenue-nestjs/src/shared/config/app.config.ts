import {
  INestApplication,
  RawBodyRequest,
  ValidationPipe,
} from '@nestjs/common';
import * as morgan from 'morgan';
import { Request } from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '../../app.module';
import { setupSwagger } from './swagger.config';

export async function setupApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

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

//   const origins = configService.getOrThrow<string>('CORS_ORIGINS').split(',');

//   app.enableCors({
//     origin: origins,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   });

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