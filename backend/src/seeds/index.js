import { seedAmenities } from './seeders/01.amenities.seeder.js'

const runSeeds = async () => {
  try {
    console.log('🌱 Starting seed...\n')
    await seedAmenities()
    console.log('\n✅ All seeds completed.')
  } catch (error) {
    console.error('❌ Seed failed:', error)
  } finally {
    process.exit(0)
  }
}

runSeeds()