import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedAdmin(prisma: PrismaClient) {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error('Admin seed env vars missing');
    }

    await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            name: 'Admin',
            email,
            password: await bcrypt.hash(password, 10),
            role: Role.ADMIN,
        },
    });

    console.log('✅ Admin seeded');
}