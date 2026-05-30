import { ConfigService } from '@nestjs/config';

import { setupApp } from './shared/config/app.config';

async function bootstrap() {
  const app = await setupApp();

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

  await app.listen(port);

  console.log(`Server Started Listening: ${port}`);
}

bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});