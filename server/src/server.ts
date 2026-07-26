import 'dotenv/config';
import type { Server } from 'http';

import { app } from './app';
import { connectDatabase } from './configs/database.config';
import { validateEnv } from './configs/envValidation.config';
import { validateEmailConfig } from './services/email.service';
import { startEmailWorker } from './workers/email.worker';
import { startBanExpiryWorker } from './workers/banExpiry.worker';
import { startAutoSuspendWorker } from './workers/venueEditDeadline.worker';
import { startBookingStatusWorker } from './workers/bookingStatus.worker';
import { setupGracefulShutdown } from './utils/shutdownUtils';
import { logInfo } from './utils/logger';
import { verifyRbacSeed } from './services/roles.service';

const PORT = parseInt(process.env.PORT ?? '3000', 10);

let server: Server | null = null;

// Start server
async function startServer(): Promise<void> {
  validateEnv();
  validateEmailConfig();
  await connectDatabase();
  await verifyRbacSeed();
  startEmailWorker();
  startBanExpiryWorker();
  startAutoSuspendWorker();
  startBookingStatusWorker();
  server = app.listen(PORT, '0.0.0.0', () => {
    logInfo(`Server started on port ${String(PORT)}`);
  });
  // Register shutdown handlers AFTER server is assigned so the getter returns the live instance
  setupGracefulShutdown(() => server);
}

void startServer();
