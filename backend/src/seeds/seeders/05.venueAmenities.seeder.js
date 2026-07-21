import { db } from '../../db/index.js';
import { venueAmenities, amenities } from '../../models/index.js';
import { eq } from 'drizzle-orm';

export const seedVenueAmenities = async () => {
  console.log('Seeding venue amenities...');

  // Get all amenities and map by slug
  const allAmenities = await db.select({ id: amenities.id, slug: amenities.slug }).from(amenities);

  if (allAmenities.length === 0) {
    throw new Error('No amenities found. Please seed amenities first.');
  }

  const amenityMap = {};
  allAmenities.forEach((amenity) => {
    amenityMap[amenity.slug] = amenity.id;
  });

  const venueAmenitiesData = [
    // Grand Ballroom amenities
    { venueId: '550e8400-e29b-41d4-a716-446655440010', amenityId: amenityMap['wifi'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440010', amenityId: amenityMap['parking'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440010', amenityId: amenityMap['ac'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440010', amenityId: amenityMap['kitchen'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440010', amenityId: amenityMap['security'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440010', amenityId: amenityMap['projector'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440010', amenityId: amenityMap['stage'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440010', amenityId: amenityMap['catering'] },
    // Tech Hub Meeting Rooms amenities
    { venueId: '550e8400-e29b-41d4-a716-446655440011', amenityId: amenityMap['wifi'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440011', amenityId: amenityMap['ac'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440011', amenityId: amenityMap['projector'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440011', amenityId: amenityMap['av_equipment'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440011', amenityId: amenityMap['whiteboard'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440011', amenityId: amenityMap['wheelchair'] },
    // Garden Bistro amenities
    { venueId: '550e8400-e29b-41d4-a716-446655440012', amenityId: amenityMap['wifi'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440012', amenityId: amenityMap['parking'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440012', amenityId: amenityMap['outdoor_seating'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440012', amenityId: amenityMap['natural_light'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440012', amenityId: amenityMap['catering'] },
    // Cozy Workspace amenities
    { venueId: '550e8400-e29b-41d4-a716-446655440013', amenityId: amenityMap['wifi'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440013', amenityId: amenityMap['ac'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440013', amenityId: amenityMap['parking'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440013', amenityId: amenityMap['wheelchair'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440013', amenityId: amenityMap['natural_light'] },
    // Penthouse Suite amenities
    { venueId: '550e8400-e29b-41d4-a716-446655440014', amenityId: amenityMap['wifi'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440014', amenityId: amenityMap['ac'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440014', amenityId: amenityMap['security'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440014', amenityId: amenityMap['catering'] },
    { venueId: '550e8400-e29b-41d4-a716-446655440014', amenityId: amenityMap['outdoor_seating'] },
    // Rusty Shed amenities
    { venueId: '550e8400-e29b-41d4-a716-446655440015', amenityId: amenityMap['natural_light'] },
  ];

  await db.insert(venueAmenities).values(venueAmenitiesData).onConflictDoNothing();
  console.log('✓ Venue amenities done');
};
