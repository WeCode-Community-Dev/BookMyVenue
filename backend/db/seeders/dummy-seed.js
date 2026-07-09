// backend/db/seeders/dummy-seed.js
const pool = require('../../config/db');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting Dummy Seeding for BookMyVenue...');

    // === Seed Users ===
    await pool.query(`
      INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
      VALUES 
        ('Alice Johnson', 'alice@bookmyvenue.com', '$2b$10$dummyhash123456789', 'admin', NOW(), NOW()),
        ('Bob Smith', 'bob@bookmyvenue.com', '$2b$10$dummyhash123456789', 'user', NOW(), NOW()),
        ('Charlie Brown', 'charlie@bookmyvenue.com', '$2b$10$dummyhash123456789', 'organizer', NOW(), NOW()),
        ('Diana Prince', 'diana@bookmyvenue.com', '$2b$10$dummyhash123456789', 'user', NOW(), NOW())
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('👥 Users seeded');

    // === Seed Venues ===
    await pool.query(`
      INSERT INTO venues (owner_id, name, description, city, address, capacity, 
                         price_per_hour, is_active, is_verified, created_at, updated_at)
      VALUES 
        (1, 'Grand Palace Hall', 'Luxurious AC banquet hall with stage and parking', 'Bangalore', '123 MG Road', 300, 
         4500, true, true, NOW(), NOW()),
        (2, 'Skyline Rooftop', 'Beautiful open rooftop with stunning city view', 'Bangalore', '45 Brigade Road', 150, 
         3800, true, true, NOW(), NOW()),
        (1, 'Green Valley Lawn', 'Spacious outdoor lawn perfect for weddings & events', 'Bangalore', '78 Residency Road', 500, 
         6500, true, true, NOW(), NOW()),
        (3, 'Crystal Ballroom', 'Elegant indoor venue with modern amenities', 'Bangalore', '12 Church Street', 250, 
         5200, true, true, NOW(), NOW())
      ON CONFLICT DO NOTHING;
    `);
    console.log('📍 Venues seeded');

    // === Seed Bookings ===
    await pool.query(`
      INSERT INTO bookings (user_id, venue_id, start_datetime, end_datetime, 
                           status, total_price,  notes, created_at)
      VALUES 
        (2, 1, '2026-07-20 10:00:00', '2026-07-20 14:00:00', 'confirmed', 18000,  'Wedding reception', NOW()),
        (3, 2, '2026-07-25 18:00:00', '2026-07-25 22:00:00', 'pending', 15200,  'Corporate event', NOW()),
        (4, 3, '2026-08-05 09:00:00', '2026-08-05 13:00:00', 'confirmed', 26000,  'Birthday celebration', NOW())
      ON CONFLICT DO NOTHING;
    `);
    console.log('📅 Bookings seeded');

    console.log('✅ Dummy Seeding Completed Successfully! 🎉');

  } catch (error) {
    console.error('❌ Seeding Failed:', error.message);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;