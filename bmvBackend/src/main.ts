import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix, excluding the root endpoint
  app.setGlobalPrefix('api', { exclude: ['/'] });

  // Enable CORS for frontend requests
  const corsOrigin = process.env.CORS_ORIGIN;
  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(',') : 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Enforce DTO validation globally across all endpoints
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Strip properties not in the DTO
      // forbidNonWhitelisted: true, // Throw 400 if unknown properties are sent
      transform: true,            // Auto-transform payloads to DTO class instances
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
