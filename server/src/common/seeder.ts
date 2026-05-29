import { INestApplication } from '@nestjs/common';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export async function seedDatabase(app: INestApplication): Promise<void> {
  try {
    const userRepository = app.get('UserRepository');
    
    console.log('🌱 Checking default database seed accounts...');

    // 1. Seed / Update Admin
    let admin = await userRepository.findOne({ where: { email: 'admin@bookmyvenue.com' } });
    const adminSalt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', adminSalt);
    if (!admin) {
      admin = userRepository.create({
        name: 'System Administrator',
        email: 'admin@bookmyvenue.com',
        password: adminPassword,
        role: UserRole.ADMIN,
        phone: '1234567890',
      });
      console.log('✅ Default Admin created: admin@bookmyvenue.com (pwd: Admin@123)');
    } else {
      admin.password = adminPassword;
      console.log('🔄 Default Admin password updated: admin@bookmyvenue.com (pwd: Admin@123)');
    }
    await userRepository.save(admin);

    // 2. Seed / Update Venue Owner
    let owner = await userRepository.findOne({ where: { email: 'owner@bookmyvenue.com' } });
    const ownerSalt = await bcrypt.genSalt(10);
    const ownerPassword = await bcrypt.hash('Owner@123', ownerSalt);
    if (!owner) {
      owner = userRepository.create({
        name: 'Elite Venue Owner',
        email: 'owner@bookmyvenue.com',
        password: ownerPassword,
        role: UserRole.VENUE_OWNER,
        phone: '0987654321',
      });
      console.log('✅ Default Host created: owner@bookmyvenue.com (pwd: Owner@123)');
    } else {
      owner.password = ownerPassword;
      console.log('🔄 Default Host password updated: owner@bookmyvenue.com (pwd: Owner@123)');
    }
    await userRepository.save(owner);

    // 3. Seed / Update Guest User
    let guest = await userRepository.findOne({ where: { email: 'guest@bookmyvenue.com' } });
    const userSalt = await bcrypt.genSalt(10);
    const userPassword = await bcrypt.hash('User@123', userSalt);
    if (!guest) {
      guest = userRepository.create({
        name: 'John Doe',
        email: 'guest@bookmyvenue.com',
        password: userPassword,
        role: UserRole.USER,
        phone: '5555555555',
      });
      console.log('✅ Default Guest created: guest@bookmyvenue.com (pwd: User@123)');
    } else {
      guest.password = userPassword;
      console.log('🔄 Default Guest password updated: guest@bookmyvenue.com (pwd: User@123)');
    }
    await userRepository.save(guest);

    console.log('🌱 Seeding process complete!');
  } catch (err) {
    console.warn('⚠️ Seeding skipped or database tables not initialized yet:', err.message);
  }
}
