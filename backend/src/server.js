import app from './app.js';
import { loadEnv } from './config/env.js';
import prisma from './config/prisma.js';

const env = loadEnv();

const server = app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
  console.log(`Health check: http://localhost:${env.port}/api/v1/health`);
});

async function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
