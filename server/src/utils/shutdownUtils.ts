import mongoose from 'mongoose';
import type { Server } from 'http';
import { stopEmailWorker } from '../workers/email.worker';
import { logInfo, logWarn, logError } from '../utils/logger';

let isShuttingDown = false;
let getServerFn: (() => Server | null) | null = null;

// Utility
const withTimeout = async <T>(promise: Promise<T>, ms: number, name: string): Promise<void> => {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`[Timeout] ${name} shutdown exceeded ${ms.toString()}ms`));
    }, ms);
  });

  try {
    await Promise.race([promise, timeoutPromise]);
  } catch (err) {
    logError(`[server] ${name} failed to shut down cleanly`, {
      module: 'shutdownUtils.ts/withTimeout',
      error: (err as Error).message,
    });
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
};

async function gracefulShutdown(signal: string, exitCode = 0): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logInfo(`[server] ${signal} received. Initiating graceful shutdown...`);

  // Global Hard Timeout
  const forceExitTimer = setTimeout(() => {
    logError('[server] GLOBAL shutdown timeout reached (30s). Forcing exit.', {
      module: 'shutdownUtils.ts/gracefulShutdown',
    });
    process.exit(exitCode);
  }, 30_000);
  forceExitTimer.unref();

  try {
    const server = getServerFn ? getServerFn() : null;

    // STEP 1: HTTP Server (Max 5 seconds)
    if (server) {
      logInfo('[server] Stopping HTTP server...');

      // Fatal crash
      if (signal === 'Uncaught Exception' || signal === 'Unhandled Rejection') {
        if ('closeAllConnections' in server) {
          logWarn('[server] Fatal crash detected. Severing all active HTTP connections.');
          server.closeAllConnections();
        }
      } else {
        if ('closeIdleConnections' in server) {
          server.closeIdleConnections();
        }
      }

      const closeHttpPromise = new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });

      await withTimeout(closeHttpPromise, 5000, 'HTTP Server');
      logInfo('[server] HTTP server closed.');
    }

    logInfo('[server] Stopping email worker...');
    await withTimeout(stopEmailWorker(), 3000, 'Email Worker');
    logInfo('[server] Email worker stopped.');

    logInfo('[server] Closing MongoDB connection...');
    await withTimeout(mongoose.connection.close(false), 3000, 'MongoDB');
    logInfo('[server] MongoDB connection closed.');
  } catch (err) {
    logError('[server] Unexpected error during shutdown sequence', {
      module: 'shutdownUtils.ts/gracefulShutdown',
      error: (err as Error).message,
    });
  }

  logInfo('[server] Shutdown sequence complete.');
  process.exit(exitCode);
}

export function setupGracefulShutdown(getServer: () => Server | null): void {
  getServerFn = getServer;

  process.on('unhandledRejection', (reason) => {
    logError('Unhandled Rejection', {
      module: 'shutdownUtils.ts/setupGracefulShutdown',
      reason: String(reason),
    });
    void gracefulShutdown('Unhandled Rejection', 1);
  });

  process.on('uncaughtException', (error) => {
    logError('Uncaught Exception', {
      module: 'shutdownUtils.ts/setupGracefulShutdown',
      error: error.message,
      stack: error.stack,
    });
    void gracefulShutdown('Uncaught Exception', 1);
  });

  process.on('SIGINT', () => {
    void gracefulShutdown('SIGINT');
  });

  process.on('SIGTERM', () => {
    void gracefulShutdown('SIGTERM');
  });
}
