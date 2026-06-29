import { relations } from 'drizzle-orm';
import { venuesTable, venuePricing } from './venueModel.js';
import { venueAmenities, amenities } from './amenityModel.js';
import { userFavourites, usersTable } from './userModel.js';
import { bookingsTable } from './bookingModel.js';
import { paymentsTable } from './paymentModel.js';

export const venueRelations = relations(venuesTable, ({ many,one }) => ({
  pricing: many(venuePricing),
  venueAmenities: many(venueAmenities),
  bookings: many(bookingsTable),
  owner: one(usersTable, {
    fields: [venuesTable.ownerId],
    references: [usersTable.id],
  }),
}));

export const venuePricingRelations = relations(venuePricing, ({ one }) => ({
  venue: one(venuesTable, {
    fields: [venuePricing.venueId],
    references: [venuesTable.id],
  }),
}));

export const venueAmenitiesRelations = relations(venueAmenities, ({ one }) => ({
  venue: one(venuesTable, {
    fields: [venueAmenities.venueId],
    references: [venuesTable.id],
  }),
  amenity: one(amenities, {
    fields: [venueAmenities.amenityId],
    references: [amenities.id],
  }),
}));

export const amenitiesRelations = relations(amenities, ({ many }) => ({
  venueAmenities: many(venueAmenities),
}));

export const userFavouritesRelations = relations(userFavourites, ({ one }) => ({
  venue: one(venuesTable, {
    fields: [userFavourites.venueId],
    references: [venuesTable.id],
  }),
  user: one(usersTable, {
    fields: [userFavourites.userId],
    references: [usersTable.id],
  }),
}));

export const bookingRelations = relations(bookingsTable, ({ one }) => ({
  venue: one(venuesTable, {
    fields: [bookingsTable.venueId],
    references: [venuesTable.id],
  }),

  booker: one(usersTable, {
    fields: [bookingsTable.bookerId],
    references: [usersTable.id],
  }),

  payment: one(paymentsTable, {
    fields: [bookingsTable.id],
    references: [paymentsTable.bookingId],
  }),
}));

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  booking: one(bookingsTable, {
    fields: [paymentsTable.bookingId], // FK on THIS table
    references: [bookingsTable.id], // PK on the OTHER table
  }),
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
  bookings: many(bookingsTable),
  favourites: many(userFavourites),
   venues: many(venuesTable)
}));
