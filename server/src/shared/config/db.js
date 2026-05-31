import { PrismaClient } from '@prisma/client';

console.log('Before Prisma');

const prisma = new PrismaClient();

console.log('After Prisma');

export default prisma;