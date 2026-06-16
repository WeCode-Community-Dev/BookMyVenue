import {
  pgTable,
  varchar,
  uuid,
  text,
  primaryKey,
  date,
  timestamp,
  numeric,
} from 'drizzle-orm/pg-core';
import { bookingsTable } from './bookingModel.js';

export const paymentsTable = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id')
    .references(() => bookingsTable.id)
    .notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status').notNull().default('pending'),
  paidAt: timestamp('paid_at'), // nullable — filled after verification
  createdAt: timestamp('created_at').defaultNow(),
  phonePeOrderId: varchar('phone_pe_order_id').notNull(), // your merchantOrderId
  phonePeTransactionId: varchar('phone_pe_transaction_id'), // PhonePe's internal orderId
  phonePeTransactionRef: varchar('phone_pe_transaction_ref'), // filled after payment verify
});
