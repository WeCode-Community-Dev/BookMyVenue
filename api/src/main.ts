import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {abortOnError:false});
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  app.enableCors({
    origin: 'http://localhost:4000',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


