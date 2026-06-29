import { db } from '../db/index.js';
import { venuesTable, venuePricing } from '../models/venueModel.js';
import { venueAmenities } from '../models/amenityModel.js';
import { amenities } from '../models/amenityModel.js';
import { eq, gte, ilike, and, or, sql } from 'drizzle-orm';
import { AppError } from '../handlers/error_handlers.js';

const venueServices = {
  isReadyForReview: (payload) => {
    const check = {
      hasPincode: !!payload.pincode,
      hasImages: payload.images?.length > 0,
      hasOpenDays: payload.openDays?.length > 0,
      hasOpenTime: !!payload.openTime,
      hasCloseTime: !!payload.closeTime,
      hasPricing: payload.pricing?.length > 0,
      hasAmenities: payload.venueAmenities?.length > 0,
    };
    console.log("check",check)
    const isReady = Object.values(check).every(Boolean);
    return { isReady, check };
  },

  addVenue: async function (payload) {
    const status = this.isReadyForReview(payload);

    console.log(payload,status,"payload")

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
        bookingType: payload.bookingType || 'daily',
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
            price: p.price,
            minHours: p.minHours,
            validFrom: new Date(),
            validTo: p.validTo ? new Date(p.validTo) : null,
          }))
        );
      }

      if (payload.venueAmenities && payload.venueAmenities.length > 0) {
        await tx.insert(venueAmenities).values(
          payload.venueAmenities.map((amenityId) => ({
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

updateVenue: async function(payload, id) {
  const { venueAmenities:venueAmenitiesList, ...venueData } = payload

  const result = await db.transaction(async (tx) => {
    const [response] = await tx
      .update(venuesTable)
      .set({ ...venueData, updatedAt: new Date() })
      .where(eq(venuesTable.id, id))
      .returning()

    if (venueAmenitiesList && venueAmenitiesList.length > 0) {
      await tx.delete(venueAmenities)
        .where(eq(venueAmenities.venueId, id))

      await tx.insert(venueAmenities)
        .values(venueAmenitiesList.map(amenityId => ({
          venueId: id,
          amenityId
        })))
    }

    return response
  })

  return result
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

  getVenues: async function (payload, { isAdmin = false } = {}) {
    const { page = 1, pageSize = 10, includeInactive, ...filters } = payload || {};
    const limit = parseInt(pageSize, 10) || 10;
    const currentPage = parseInt(page, 10) || 1;
    const offset = (currentPage - 1) * limit;

    const conditions = [];

    if (isAdmin) {
      // Admin uses the same /venues route but sees every venue.
    } else {
      conditions.push(eq(venuesTable.approvalStatus, 'approved'));
      if (includeInactive !== 'true' && includeInactive !== true) {
        conditions.push(eq(venuesTable.isActive, true));
      }
    }

    const filterHandlers = {
      city: (val) => ilike(venuesTable.city, `%${val}%`),
      type: (val) => eq(venuesTable.type, val),
      capacity: (val) => gte(venuesTable.capacity, parseInt(val, 10)),
      search: (val) => or(ilike(venuesTable.name, `%${val}%`), ilike(venuesTable.city, `%${val}%`)),
      approvalStatus: (val) => eq(venuesTable.approvalStatus, val),
    };

    Object.entries(filters).forEach(([key, val]) => {
      if (filterHandlers[key] && val !== undefined && val !== '') {
        conditions.push(filterHandlers[key](val));
      }
    });

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const countQuery = db.select({ count: sql`count(*)` }).from(venuesTable);
    const [{ count }] = whereClause
      ? await countQuery.where(whereClause)
      : await countQuery;

    const withRelations = {
      pricing: true,
      venueAmenities: {
        with: { amenity: true },
      },
    };

    if (isAdmin) {
      withRelations.owner = {
        columns: {
          id: true,
          username: true,
          email: true,
        },
      };
    }

    const rows = await db.query.venuesTable.findMany({
      where: whereClause,
      with: withRelations,
      ...(isAdmin && {
        orderBy: (table, { desc: descOrder }) => [descOrder(table.updatedAt)],
      }),
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

  getVenueDetails: async function (venueId) {
    const result = await db.query.venuesTable.findFirst({
      where: eq(venuesTable.id, venueId),
      with: {
        pricing: true,
        venueAmenities: {
          with: { amenity: true },
        },
      },
    });
    console.log(result,"resultresultresultresultresultresultresult")
    return result;
  },

  getPendingVenues: async function () {
    const pendingVenues = await db.query.venuesTable.findMany({
      where: eq(venuesTable.approvalStatus, 'pending'),
      with: {
        owner: {
          columns: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: (venuesTable, { asc }) => [asc(venuesTable.createdAt)],
    });
    return pendingVenues;
  },

  approveVenue: async function (venueId) {
    const [response] = await db
      .update(venuesTable)
      .set({ approvalStatus: 'approved', updatedAt: new Date() })
      .where(eq(venuesTable.id, venueId))
      .returning();

    return response;
  },

  rejectVenue: async function (venueId, reason) {
    const [response] = await db
      .update(venuesTable)
      .set({ approvalStatus: 'rejected', updatedAt: new Date(), adminNote: reason })
      .where(eq(venuesTable.id, venueId))
      .returning();

    return response;
  },

  deactivateVenue: async function (venueId, reason) {
    const [response] = await db
      .update(venuesTable)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(venuesTable.id, venueId))
      .returning();

    return response;
  },

  activateVenue: async function (venueId, reason) {
    const [response] = await db
      .update(venuesTable)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(venuesTable.id, venueId))
      .returning();

    return response;
  },

  checkSubmission: async function (venueId) {
    const venue = await db.query.venuesTable.findFirst({
      where: eq(venuesTable.id, venueId),
      with: {
        pricing: true,
        venueAmenities: true,
      },
    });

    console.log(venue,"venuevenuevenuevenuevenuevenue")

    const checkStatus = this.isReadyForReview(venue);
    if (checkStatus.isReady) {
      const response = await db
        .update(venuesTable)
        .set({ approvalStatus: 'pending' })
        .where(eq(venuesTable.id, venueId));
      return response;
    }
    if (!checkStatus.isReady) {
      throw new AppError({
        message: 'Venue profile is incomplete',
        statusCode: 400,
        errorCode: 'VENUE_NOT_READY',
        data: checkStatus.check, // so frontend knows exactly what's missing
      });
    }
  },

  getAmenities: async function(){
   const result = await db.select().from(amenities);
   return result
  }
};

export default venueServices;
