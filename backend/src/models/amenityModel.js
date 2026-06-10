import { pgTable, uuid, varchar, primaryKey } from 'drizzle-orm/pg-core'
import { venuesTable } from './venueModel.js'

export const amenities = pgTable('amenities', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  icon: varchar('icon', { length: 100 }),
  category: varchar('category', { length: 50 }),
})

export const venueAmenities = pgTable('venue_amenities', {
  venueId: uuid('venue_id').references(() => venuesTable.id).notNull(),
  amenityId: uuid('amenity_id').references(() => amenities.id).notNull(),
},
(table) => ({
  pk: primaryKey({ columns: [table.venueId, table.amenityId] })
}))