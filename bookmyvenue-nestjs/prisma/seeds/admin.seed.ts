import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { normalizeEmail } from '../../src/modules/auth/utils/normalize-email';

export async function seedAdmin(prisma: PrismaClient) {
    const rawEmail = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!rawEmail || !password) {
        throw new Error('Admin seed env vars missing');
    }

    const email = normalizeEmail(rawEmail)

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