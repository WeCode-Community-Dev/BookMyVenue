import { pgTable, uuid, text, boolean, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { usersTable } from './userModel.js';
import { venuesTable } from './venueModel.js';

export const conversationsTable = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => usersTable.id),
  ownerId: uuid('owner_id').notNull().references(() => usersTable.id),
  lastMessageAt: timestamp('last_message_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueParticipants: unique().on(table.userId, table.ownerId),
}));

export const messagesTable = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversationsTable.id),
  senderId: uuid('sender_id').notNull().references(() => usersTable.id),
  venueId: uuid('venue_id').references(() => venuesTable.id), // nullable
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  conversationCreatedIdx: index('conversation_created_idx').on(table.conversationId, table.createdAt),
  conversationReadIdx: index('conversation_read_idx').on(table.conversationId, table.isRead),
}));