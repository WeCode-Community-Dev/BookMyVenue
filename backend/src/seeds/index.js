import { seedAmenities } from './seeders/01.amenities.seeder.js';
import { seedUsers } from './seeders/02.users.seeder.js';
import { seedVenues } from './seeders/03.venues.seeder.js';
import { seedVenuePricing } from './seeders/04.venuePricing.seeder.js';
import { seedVenueAmenities } from './seeders/05.venueAmenities.seeder.js';
import { seedBookings } from './seeders/06.bookings.seeder.js';
import { seedPayments } from './seeders/07.payments.seeder.js';

const runSeeds = async () => {
  try {
    console.log('🌱 Starting seed...\n');
    await seedAmenities();
    await seedUsers();
    await seedVenues();
    await seedVenuePricing();
    await seedVenueAmenities();
    await seedBookings();
    await seedPayments();
    console.log('\n✅ All seeds completed.');
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    process.exit(0);
  }
};

runSeeds();
