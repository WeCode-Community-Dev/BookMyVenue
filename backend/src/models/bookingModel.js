import {
  pgTable,
  varchar,
  uuid,
  text,
  primaryKey,
  date,
  numeric,
  jsonb,
  timestamp,
  time
} from 'drizzle-orm/pg-core';
import { venuesTable } from './venueModel.js';
import { usersTable } from './userModel.js';

export const bookingsTable = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  venueId: uuid('venue_id')
    .references(() => venuesTable.id)
    .notNull(),
  bookerId: uuid('booker_id')
    .references(() => usersTable.id)
    .notNull(),
  startDate: date('start_date').notNull(), // date, not timestamp — no time needed
  endDate: date('end_date').notNull(),
  status: varchar('status').notNull().default('pending'),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  pricingSnapshot: jsonb('pricing_snapshot').notNull(),
  note: varchar('note'),
  startTime: time('start_time'), // nullable — only for hourly bookings
  endTime: time('end_time'), // nullable — only for hourly bookings
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
