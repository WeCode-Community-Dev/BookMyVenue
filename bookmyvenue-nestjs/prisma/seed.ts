import { PrismaClient } from '@prisma/client';

import { seedAdmin } from './seeds/admin.seed';

const prisma = new PrismaClient();

async function main() {
  await seedAdmin(prisma);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });