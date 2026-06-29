import { loadEnv } from '../config/env.js';
import prisma from '../config/prisma.js';

async function main() {
  const env = loadEnv();

  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;

  console.log('Setup check passed.');
  console.log(`  Database: ${env.databaseUrl.replace(/\/\/.*@/, '//***@')}`);
  console.log(`  Port:     ${env.port}`);
  console.log(`  NODE_ENV: ${env.nodeEnv}`);
}

main()
  .catch((error) => {
    console.error('Setup check failed:', error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
