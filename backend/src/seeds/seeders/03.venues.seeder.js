import { db } from '../../db/index.js';
import { venuesTable } from '../../models/venueModel.js';
import { usersTable } from '../../models/userModel.js';
import { eq } from 'drizzle-orm';

export const seedVenues = async () => {
  console.log('Seeding venues...');
  
  // Get the actual user IDs from the database
  const johnOwner = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.username, 'john_owner'))
    .limit(1);
  
  const janeOwner = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.username, 'jane_owner'))
    .limit(1);

  if (!johnOwner[0] || !janeOwner[0]) {
    throw new Error('Users not found. Please seed users first.');
  }

  const venuesData = [
    {
      id: '550e8400-e29b-41d4-a716-446655440010',
      ownerId: johnOwner[0].id,
      name: 'Grand Ballroom',
      description: 'Elegant ballroom perfect for weddings and corporate events',
      type: 'banquet_hall',
      address: '123 Main Street, Downtown',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      latitude: '19.0760',
      longitude: '72.8777',
      capacity: 500,
      images: [
        { url: 'https://example.com/ballroom1.jpg', alt: 'Main hall' },
        { url: 'https://example.com/ballroom2.jpg', alt: 'Decorated hall' },
      ],
      openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      openTime: '10:00',
      closeTime: '23:00',
      minBookingHours: 4,
      isActive: true,
      approvalStatus: 'approved',
      adminNote: null,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440011',
      ownerId: janeOwner[0].id,
      name: 'Tech Hub Meeting Rooms',
      description: 'Modern meeting spaces with latest technology',
      type: 'meeting_room',
      address: '456 Tech Park, Bandra',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400051',
      latitude: '19.0596',
      longitude: '72.8295',
      capacity: 50,
      images: [
        { url: 'https://example.com/office1.jpg', alt: 'Meeting room' },
        { url: 'https://example.com/office2.jpg', alt: 'Conference setup' },
      ],
      openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      openTime: '09:00',
      closeTime: '18:00',
      minBookingHours: 1,
      isActive: true,
      approvalStatus: 'approved',
      adminNote: null,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440012',
      ownerId: johnOwner[0].id,
      name: 'Garden Bistro',
      description: 'Outdoor garden venue perfect for intimate gatherings',
      type: 'outdoor_space',
      address: '789 Garden Lane, Andheri',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400072',
      latitude: '19.1136',
      longitude: '72.8697',
      capacity: 100,
      images: [
        { url: 'https://example.com/garden1.jpg', alt: 'Garden setup' },
      ],
      openDays: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
      openTime: '17:00',
      closeTime: '23:00',
      minBookingHours: 3,
      isActive: true,
      approvalStatus: 'approved',
      adminNote: null,
    },
  ];

  await db.insert(venuesTable).values(venuesData).onConflictDoNothing();
  console.log('✓ Venues done');
};
