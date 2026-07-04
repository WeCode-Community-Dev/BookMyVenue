import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './presentation/app.module';
import { NestjsConsoleLogger } from './infra/logger/console.logger';
import { DomainExceptionFilter } from './presentation/filters/domain-exception.filter';
import { VersioningType } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,);

  app.useLogger(new NestjsConsoleLogger());
  app.useGlobalFilters(new DomainExceptionFilter());

  // versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useStaticAssets(
    join(process.cwd(), 'uploads'),
    {
      prefix: '/uploads',
    },
  );

  app.setGlobalPrefix('api', {
    exclude: ['health/*', '/']
  });

  const config = new DocumentBuilder()
    .setTitle('BMV API Documentation')
    .setDescription('API documentation for the BookMyVenue application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
    },
    swaggerUiEnabled: true
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
