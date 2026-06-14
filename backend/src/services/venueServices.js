import { db } from '../db/index.js';
import { venuesTable, venuePricing } from '../models/venueModel.js';
import { venueAmenities } from '../models/amenityModel.js';
import { eq, gte, ilike, and, or, sql } from 'drizzle-orm';

const venueServices = {
  isReadyForReview: (payload) => {
    const check = {
      hasPincode: !!payload.pincode,
      hasImages: payload.images?.length > 0,
      hasOpenDays: payload.openDays?.length > 0,
      hasOpenTime: !!payload.openTime,
      hasCloseTime: !!payload.closeTime,
      hasPricing: payload.pricing?.length > 0,
      hasAmenities: payload.amenities?.length > 0,
    };

    const isReady = Object.values(check).every(Boolean);
    return { isReady, check };
  },

  addVenue: async function (payload) {
    const status = this.isReadyForReview(payload);

    const venue = await db.transaction(async (tx) => {
      const venueData = {
        ownerId: payload.ownerId,
        name: payload.name,
        description: payload.description,
        type: payload.type,
        address: payload.address,
        city: payload.city,
        state: payload.state,
        pincode: payload.pincode,
        latitude: payload.latitude,
        longitude: payload.longitude,
        capacity: payload.capacity,
        images: payload.images,
        openDays: payload.openDays,
        openTime: payload.openTime,
        closeTime: payload.closeTime,
        minBookingHours: payload.minBookingHours,
        isActive: false,
        approvalStatus: status.isReady ? 'pending' : 'draft',
      };

      console.log(venueData, 'venue');
      const [venue] = await tx.insert(venuesTable).values(venueData).returning();

      if (payload.pricing && payload.pricing.length > 0) {
        await tx.insert(venuePricing).values(
          payload.pricing.map((p) => ({
            venueId: venue.id,
            dayType: p.dayType,
            pricePerHour: p.pricePerHour,
            minHours: p.minHours,
            validFrom: new Date(),
            validTo: p.validTo ? new Date(p.validTo) : null,
          }))
        );
      }

      if (payload.amenities && payload.amenities.length > 0) {
        await tx.insert(venueAmenities).values(
          payload.amenities.map((amenityId) => ({
            venueId: venue.id,
            amenityId,
          }))
        );
      }

      return venue;
    });

    return {
      venue,
      isReadyForReview: status.isReady,
      reviewChecklist: status.check,
    };
  },

  getOwnerVenues: async function (ownerId) {
    const response = await db.query.venuesTable.findMany({
      where: eq(venuesTable.ownerId, ownerId),
      with: {
        pricing: true,
        venueAmenities: {
          with: {
            amenity: true,
          },
        },
      },
    });

    return response;
  },

  getVenues: async function (payload) {
    const { page = 1, pageSize = 10, ...filters } = payload || {};
    const limit = parseInt(pageSize, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;
    const offset = (currentPage - 1) * limit;

    const conditions = [eq(venuesTable.approvalStatus, 'approved'), eq(venuesTable.isActive, true)];

    const filterHandlers = {
      city: (val) => ilike(venuesTable.city, `%${val}%`),
      type: (val) => eq(venuesTable.type, val),
      capacity: (val) => gte(venuesTable.capacity, parseInt(val, 10)),
      search: (val) => or(ilike(venuesTable.name, `%${val}%`), ilike(venuesTable.city, `%${val}%`)),
    };

    Object.entries(filters).forEach(([key, val]) => {
      if (filterHandlers[key] && val) {
        conditions.push(filterHandlers[key](val));
      }
    });

    // total count
    const [{ count }] = await db.select({ count: sql`count(*)` }).from(venuesTable).where(and(...conditions));

    const rows = await db.query.venuesTable.findMany({
      where: and(...conditions),
      with: {
        pricing: true,
        venueAmenities: {
          with: { amenity: true },
        },
      },
      limit,
      offset,
    });

    return {
      rows,
      total: parseInt(count, 10) || 0,
      page: currentPage,
      pageSize: limit,
    };
  },

  getVenueDetails: async function(venueId) {
    const result = await db.query.venuesTable.findFirst({
        where: eq(venuesTable.id, venueId),
        with: {
            pricing: true,
            venueAmenities: {
                with: { amenity: true }
            }
        }
    })
    return result;
}
};

export default venueServices;
