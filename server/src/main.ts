import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('BookMyVenue API')
    .setDescription(
      'BookMyVenue (BMV) — Location-based venue discovery and booking platform.\n\n' +
      '## Features\n' +
      '- User registration and authentication (JWT)\n' +
      '- Venue discovery with geo-based nearby search\n' +
      '- Smart venue filtering (type, capacity, price, rating)\n' +
      '- Booking system with conflict prevention (lock engine)\n' +
      '- Reviews and ratings\n' +
      '- Venue owner dashboard\n' +
      '- Admin panel for platform management\n\n' +
      '## Roles\n' +
      '- **user** — Discover & book venues\n' +
      '- **venue_owner** — List & manage venues\n' +
      '- **admin** — Platform administration',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication & authorization endpoints')
    .addTag('Users', 'User profile management')
    .addTag('Venues', 'Venue discovery, CRUD & management')
    .addTag('Bookings', 'Booking creation, management & history')
    .addTag('Booking Locks', 'Temporary slot lock engine')
    .addTag('Reviews', 'Venue reviews & ratings')
    .addTag('Admin', 'Platform administration & analytics')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'BookMyVenue API Docs',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 BookMyVenue API running on http://localhost:${port}`);
  console.log(`📖 Swagger docs available at http://localhost:${port}/api/docs`);
}
bootstrap();
