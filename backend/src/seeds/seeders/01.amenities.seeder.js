import { db } from '../../db/index.js';
import { amenities } from '../../models/amenityModel.js';
import { amenitiesData } from '../data/amenities.js';

export const seedAmenities = async () => {
  console.log('Seeding amenities...');
  await db.insert(amenities).values(amenitiesData).onConflictDoNothing();
  console.log('✓ Amenities done');
};
