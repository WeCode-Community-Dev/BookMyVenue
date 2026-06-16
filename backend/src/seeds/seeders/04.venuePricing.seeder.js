import { db } from '../../db/index.js';
import { venuePricing } from '../../models/venueModel.js';

export const seedVenuePricing = async () => {
  console.log('Seeding venue pricing...');

  const venuePricingData = [
    // Grand Ballroom pricing (daily)
    {
      venueId: '550e8400-e29b-41d4-a716-446655440010',
      dayType: 'weekday',
      price: '35000.00',
      minHours: 1,
      validFrom: new Date('2024-01-01'),
      validTo: null,
    },
    {
      venueId: '550e8400-e29b-41d4-a716-446655440010',
      dayType: 'weekend',
      price: '50000.00',
      minHours: 1,
      validFrom: new Date('2024-01-01'),
      validTo: null,
    },
    {
      venueId: '550e8400-e29b-41d4-a716-446655440010',
      dayType: 'holiday',
      price: '60000.00',
      minHours: 1,
      validFrom: new Date('2024-01-01'),
      validTo: null,
    },
    // Tech Hub Meeting Rooms pricing (hourly)
    {
      venueId: '550e8400-e29b-41d4-a716-446655440011',
      dayType: 'weekday',
      price: '600.00',
      minHours: 1,
      validFrom: new Date('2024-01-01'),
      validTo: null,
    },
    {
      venueId: '550e8400-e29b-41d4-a716-446655440011',
      dayType: 'weekend',
      price: '900.00',
      minHours: 2,
      validFrom: new Date('2024-01-01'),
      validTo: null,
    },
    // Garden Bistro pricing (daily)
    {
      venueId: '550e8400-e29b-41d4-a716-446655440012',
      dayType: 'weekday',
      price: '15000.00',
      minHours: 1,
      validFrom: new Date('2024-01-01'),
      validTo: null,
    },
    {
      venueId: '550e8400-e29b-41d4-a716-446655440012',
      dayType: 'weekend',
      price: '25000.00',
      minHours: 1,
      validFrom: new Date('2024-01-01'),
      validTo: null,
    },
    // Cozy Workspace pricing (hourly)
    {
      venueId: '550e8400-e29b-41d4-a716-446655440013',
      dayType: 'weekday',
      price: '150.00',
      minHours: 1,
      validFrom: new Date('2024-01-01'),
      validTo: null,
    },
    {
      venueId: '550e8400-e29b-41d4-a716-446655440013',
      dayType: 'weekend',
      price: '250.00',
      minHours: 1,
      validFrom: new Date('2024-01-01'),
      validTo: null,
    },
    // Penthouse Suite pricing (daily)
    {
      venueId: '550e8400-e29b-41d4-a716-446655440014',
      dayType: 'weekday',
      price: '40000.00',
      minHours: 1,
      validFrom: new Date('2024-01-01'),
      validTo: null,
    },
    {
      venueId: '550e8400-e29b-41d4-a716-446655440014',
      dayType: 'weekend',
      price: '55000.00',
      minHours: 1,
      validFrom: new Date('2024-01-01'),
      validTo: null,
    },
    // Rusty Shed pricing (hourly)
    {
      venueId: '550e8400-e29b-41d4-a716-446655440015',
      dayType: 'weekday',
      price: '100.00',
      minHours: 2,
      validFrom: new Date('2024-01-01'),
      validTo: null,
    },
    {
      venueId: '550e8400-e29b-41d4-a716-446655440015',
      dayType: 'weekend',
      price: '150.00',
      minHours: 2,
      validFrom: new Date('2024-01-01'),
      validTo: null,
    },
  ];

  await db.insert(venuePricing).values(venuePricingData).onConflictDoNothing();
  console.log('✓ Venue pricing done');
};
