import { pgTable, varchar, uuid, text } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  username: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 50 }).notNull().default('user'), // Add role field with default value
  salt: text().notNull(), // Add salt if your hashPassword utility generates it!
});
