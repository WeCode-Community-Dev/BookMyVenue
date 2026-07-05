import fs from 'fs';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    console.log('Reading schema.sql...');
    const schemaSql = fs.readFileSync('schema.sql', 'utf8');

    console.log('Connecting to database and running schema.sql...');
    await pool.query(schemaSql);
    console.log('Database tables created successfully!');

    console.log('Seeding initial users...');
    const usersToSeed = [
      { name: 'Admin User', email: 'admin@gmail.com', password: 'test123', role: 'admin' },
      { name: 'Regular User', email: 'user@gmail.com', password: 'test123', role: 'user' },
      { name: 'Venue Owner', email: 'owner@gmail.com', password: 'test123', role: 'venue_owner' },
    ];

    const salt = await bcrypt.genSalt(15);

    for (const u of usersToSeed) {
      const hashedPassword = await bcrypt.hash(u.password, salt);
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        [u.name, u.email.toLowerCase().trim(), hashedPassword, u.role]
      );
      console.log(`Seeded user: ${u.email} (${u.role})`);
    }

    console.log('Database reset and seed finished successfully!');
  } catch (err) {
    console.error('Error resetting database:', err);
  } finally {
    await pool.end();
  }
}

main();
