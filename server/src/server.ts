import env from '@/configs/env.config';

import app from './app';
import { connectDB } from '@/configs/db.config';
import logger from './libs/logger';

import { startScheduler } from '@/utils/scheduler';

const startServer = async () => {
  try {
    await connectDB();
    startScheduler();

    app.listen(env.PORT, () => {
      logger.info(`Server running on port http://localhost:${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:' + error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection: ' + reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:' + error);
  process.exit(1);
});

startServer();
