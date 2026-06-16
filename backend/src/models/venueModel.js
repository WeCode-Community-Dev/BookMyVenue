import {
  pgTable,
  varchar,
  uuid,
  text,
  decimal,
  integer,
  jsonb,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { usersTable } from './userModel.js';

export const venuesTable = pgTable('venues', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id')
    .references(() => usersTable.id)
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  pincode: varchar('pincode', { length: 20 }),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  capacity: integer('capacity').notNull(),
  images: jsonb('images').default([]),
  openDays: jsonb('open_days').default([]),
  openTime: varchar('open_time', { length: 5 }),
  closeTime: varchar('close_time', { length: 5 }),
  minBookingHours: integer('min_booking_hours').default(1),
  isActive: boolean('is_active').notNull().default(true),
  approvalStatus: varchar('approval_status', { length: 20 }).notNull().default('pending'),
  adminNote: text('admin_note'),
  bookingType: varchar('booking_type').notNull().default('daily'), // 'hourly' | 'daily'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const venuePricing = pgTable('venue_pricing', {
  id: uuid('id').defaultRandom().primaryKey(),
  venueId: uuid('venue_id')
    .references(() => venuesTable.id)
    .notNull(),
  dayType: varchar('day_type', { length: 20 }).notNull(), // weekday / weekend / holiday
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  minHours: integer('min_hours').notNull().default(1),
  validFrom: timestamp('valid_from').defaultNow().notNull(),
  validTo: timestamp('valid_to'), // null = currently active
  
});
