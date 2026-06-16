import { db } from '../../db/index.js';
import { bookingsTable } from '../../models/bookingModel.js';
import { usersTable } from '../../models/userModel.js';
import { eq } from 'drizzle-orm';

export const seedBookings = async () => {
  console.log('Seeding bookings...');

  const alex = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.username, 'alex_user'))
    .limit(1);

  const sarah = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.username, 'sarah_user'))
    .limit(1);

  const michael = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.username, 'michael_user'))
    .limit(1);

  if (!alex[0] || !sarah[0] || !michael[0]) {
    throw new Error('Bookers not found. Please seed users first.');
  }

  const bookingsData = [
    // 1. Grand Ballroom - Approved Daily Booking (Alex)
    // Dates: 2026-07-01 to 2026-07-02 (2 weekdays)
    // Rate: Weekday = 35000.00. Total = 70000.00
    {
      id: '550e8400-e29b-41d4-a716-446655440050',
      venueId: '550e8400-e29b-41d4-a716-446655440010',
      bookerId: alex[0].id,
      startDate: '2026-07-01',
      endDate: '2026-07-02',
      status: 'approved',
      totalAmount: '70000.00',
      pricingSnapshot: {
        bookingType: 'daily',
        basePrice: '35000.00',
        breakdown: [
          { date: '2026-07-01', dayType: 'weekday', price: '35000.00' },
          { date: '2026-07-02', dayType: 'weekday', price: '35000.00' }
        ]
      },
      note: 'Need wedding decorations setup on the evening before.',
      startTime: null,
      endTime: null,
    },
    // 2. Tech Hub Meeting Rooms - Pending Hourly Booking (Sarah)
    // Date: 2026-07-05 (Sunday - Weekend)
    // Rate: Weekend = 900.00. Hours: 10:00 to 14:00 (4 hours). Total = 3600.00
    {
      id: '550e8400-e29b-41d4-a716-446655440051',
      venueId: '550e8400-e29b-41d4-a716-446655440011',
      bookerId: sarah[0].id,
      startDate: '2026-07-05',
      endDate: '2026-07-05',
      status: 'pending',
      totalAmount: '3600.00',
      pricingSnapshot: {
        bookingType: 'hourly',
        pricePerHour: '900.00',
        hours: 4,
        date: '2026-07-05',
        dayType: 'weekend'
      },
      note: 'Board meeting. Please ensure HDMI cables and whiteboard markers are available.',
      startTime: '10:00:00',
      endTime: '14:00:00',
    },
    // 3. Garden Bistro - Cancelled Daily Booking (Alex)
    // Dates: 2026-07-10 to 2026-07-11 (Friday = Weekday: 15000.00, Saturday = Weekend: 25000.00)
    // Total = 40000.00
    {
      id: '550e8400-e29b-41d4-a716-446655440052',
      venueId: '550e8400-e29b-41d4-a716-446655440012',
      bookerId: alex[0].id,
      startDate: '2026-07-10',
      endDate: '2026-07-11',
      status: 'cancelled',
      totalAmount: '40000.00',
      pricingSnapshot: {
        bookingType: 'daily',
        breakdown: [
          { date: '2026-07-10', dayType: 'weekday', price: '15000.00' },
          { date: '2026-07-11', dayType: 'weekend', price: '25000.00' }
        ]
      },
      note: 'Birthday celebration. Cancelled due to weather forecast.',
      startTime: null,
      endTime: null,
    },
    // 4. Cozy Workspace - Rejected Hourly Booking (Michael)
    // Date: 2026-07-12 (Sunday - Weekend)
    // Rate: Weekend = 250.00. Hours: 14:00 to 16:00 (2 hours). Total = 500.00
    {
      id: '550e8400-e29b-41d4-a716-446655440053',
      venueId: '550e8400-e29b-41d4-a716-446655440013',
      bookerId: michael[0].id,
      startDate: '2026-07-12',
      endDate: '2026-07-12',
      status: 'rejected',
      totalAmount: '500.00',
      pricingSnapshot: {
        bookingType: 'hourly',
        pricePerHour: '250.00',
        hours: 2,
        date: '2026-07-12',
        dayType: 'weekend'
      },
      note: 'Need workspace for exam prep. Rejected because the venue is booked for maintenance.',
      startTime: '14:00:00',
      endTime: '16:00:00',
    },
    // 5. Grand Ballroom - Approved Daily Booking (Sarah)
    // Dates: 2026-07-15 to 2026-07-15 (1 weekday)
    // Rate: Weekday = 35000.00. Total = 35000.00
    {
      id: '550e8400-e29b-41d4-a716-446655440054',
      venueId: '550e8400-e29b-41d4-a716-446655440010',
      bookerId: sarah[0].id,
      startDate: '2026-07-15',
      endDate: '2026-07-15',
      status: 'approved',
      totalAmount: '35000.00',
      pricingSnapshot: {
        bookingType: 'daily',
        basePrice: '35000.00',
        breakdown: [
          { date: '2026-07-15', dayType: 'weekday', price: '35000.00' }
        ]
      },
      note: 'Corporate workshop.',
      startTime: null,
      endTime: null,
    },
    // 6. Cozy Workspace - Approved Hourly Booking (Michael)
    // Date: 2026-07-14 (Tuesday - Weekday)
    // Rate: Weekday = 150.00. Hours: 09:00 to 17:00 (8 hours). Total = 1200.00
    {
      id: '550e8400-e29b-41d4-a716-446655440055',
      venueId: '550e8400-e29b-41d4-a716-446655440013',
      bookerId: michael[0].id,
      startDate: '2026-07-14',
      endDate: '2026-07-14',
      status: 'approved',
      totalAmount: '1200.00',
      pricingSnapshot: {
        bookingType: 'hourly',
        pricePerHour: '150.00',
        hours: 8,
        date: '2026-07-14',
        dayType: 'weekday'
      },
      note: 'All-day programming sprint.',
      startTime: '09:00:00',
      endTime: '17:00:00',
    },
    // 7. Tech Hub Meeting Rooms - Approved Hourly Booking (Alex)
    // Date: 2026-07-16 (Thursday - Weekday)
    // Rate: Weekday = 600.00. Hours: 14:00 to 17:00 (3 hours). Total = 1800.00
    {
      id: '550e8400-e29b-41d4-a716-446655440056',
      venueId: '550e8400-e29b-41d4-a716-446655440011',
      bookerId: alex[0].id,
      startDate: '2026-07-16',
      endDate: '2026-07-16',
      status: 'approved',
      totalAmount: '1800.00',
      pricingSnapshot: {
        bookingType: 'hourly',
        pricePerHour: '600.00',
        hours: 3,
        date: '2026-07-16',
        dayType: 'weekday'
      },
      note: 'Client presentation.',
      startTime: '14:00:00',
      endTime: '17:00:00',
    }
  ];

  await db.insert(bookingsTable).values(bookingsData).onConflictDoNothing();
  console.log('✓ Bookings done');
};
