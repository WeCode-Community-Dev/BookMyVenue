import { db } from '../../db/index.js';
import { usersTable } from '../../models/userModel.js';
import { usersData } from '../data/users.js';

export const seedUsers = async () => {
  console.log('Seeding users...');
  await db.insert(usersTable).values(usersData).onConflictDoNothing();
  console.log('✓ Users done');
};
