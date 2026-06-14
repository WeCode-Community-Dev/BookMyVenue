import { relations } from 'drizzle-orm';
import { venuesTable, venuePricing } from './venueModel.js';
import { venueAmenities, amenities } from './amenityModel.js';

export const venueRelations = relations(venuesTable, ({ many }) => ({
  pricing: many(venuePricing),
  venueAmenities: many(venueAmenities),
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
