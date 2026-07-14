import {
  pgTable,
  uuid,
  timestamp,
  jsonb,
  boolean,
  pgEnum,
  index
} from 'drizzle-orm/pg-core';
import { usersTable } from './userModel.js';

export const notificationTypeEnum = pgEnum('notification_type', ['BOOKING_CONFIRMED','VENUE_APPROVED','VENUE_REJECTED'])

export const notificationsTable = pgTable('notification', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipientId: uuid('rid').references(() => usersTable.id),
  type: notificationTypeEnum('type').notNull(),
  payload: jsonb('payload'),
  isRead: boolean('isRead').default(false),
  createdAt: timestamp('created_at').defaultNow(),
},(table) => ({
  recipientIsReadIdx: index('recipientIsReadIdx').on(table.recipientId, table.isRead)
}));
