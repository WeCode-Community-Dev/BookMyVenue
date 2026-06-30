import { PrismaClient, Role } from '@prisma/client';
import { normalizeEmail } from '../../src/modules/auth/utils/normalize-email';
import * as bcrypt from 'bcrypt';

export async function seedAdmin(prisma: PrismaClient) {
    const rawEmail = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!rawEmail || !password) {
        throw new Error('Admin seed env vars missing');
    }
    const email = normalizeEmail(rawEmail); 
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: Role.ADMIN,
        },
        create: {
            name: 'Admin',
            email, 
            password: hashedPassword,
            role: Role.ADMIN,
        },
    });

    console.log('✅ Admin seeded successfully');
}