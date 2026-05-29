import { INestApplication } from '@nestjs/common';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export async function seedDatabase(app: INestApplication): Promise<void> {
  try {
    const userRepository = app.get('UserRepository');
    const count = await userRepository.count();

    if (count === 0) {
      console.log('🌱 No users found in database. Seeding default accounts...');

      // Seed Admin
      const adminSalt = await bcrypt.genSalt(10);
      const adminPassword = await bcrypt.hash('Admin@123', adminSalt);
      const admin = userRepository.create({
        name: 'System Administrator',
        email: 'admin@bookmyvenue.com',
        password: adminPassword,
        role: UserRole.ADMIN,
        phone: '1234567890',
      });
      await userRepository.save(admin);
      console.log('✅ Default Admin created: admin@bookmyvenue.com (pwd: adminpassword)');

      // Seed Venue Owner
      const ownerSalt = await bcrypt.genSalt(10);
      const ownerPassword = await bcrypt.hash('Owner@123', ownerSalt);
      const owner = userRepository.create({
        name: 'Elite Venue Owner',
        email: 'owner@bookmyvenue.com',
        password: ownerPassword,
        role: UserRole.VENUE_OWNER,
        phone: '0987654321',
      });
      await userRepository.save(owner);
      console.log('✅ Default Host created: owner@bookmyvenue.com (pwd: ownerpassword)');

      // Seed Guest User
      const userSalt = await bcrypt.genSalt(10);
      const userPassword = await bcrypt.hash('User@123', userSalt);
      const guest = userRepository.create({
        name: 'John Doe',
        email: 'guest@bookmyvenue.com',
        password: userPassword,
        role: UserRole.USER,
        phone: '5555555555',
      });
      await userRepository.save(guest);
      console.log('✅ Default Guest created: guest@bookmyvenue.com (pwd: guestpassword)');
    }
  } catch (err) {
    console.warn('⚠️ Seeding skipped or database tables not initialized yet:', err.message);
  }
}
