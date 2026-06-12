
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './presentation/app.module';
import { NestjsConsoleLogger } from './infra/logger/console.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.useLogger(new NestjsConsoleLogger());

  const config = new DocumentBuilder()
    .setTitle('BMV API Documentation')
    .setDescription('API documentation for the BookMyVenue application')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
