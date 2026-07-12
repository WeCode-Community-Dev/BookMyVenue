import mongoose from "mongoose";
import Venue from "../models/Venue.js";
import BookingInquiry from "../models/BookingInquiry.js";

/**
 * Escapes special regex characters from user input.
 * This prevents user search text from breaking regex queries.
 */
const escapeRegex = (value = "") => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Checks whether eventDate follows YYYY-MM-DD format.
 */
const isValidDateString = (date) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

const isPastDate = (dateString) => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  return dateString < todayString;
};

/**
 * Finds venue IDs that are already booked for a selected event date.
 */
const getBookedVenueIdsByDate = async (eventDate) => {
  if (!eventDate) return [];

  if (!isValidDateString(eventDate)) {
    const error = new Error("eventDate must be in YYYY-MM-DD format");
    error.statusCode = 400;
    throw error;
  }

  if (isPastDate(eventDate)) {
    const error = new Error("Event date cannot be in the past");
    error.statusCode = 400;
    throw error;
  }

  const bookedInquiries = await BookingInquiry.find({
    eventDate,
    status: "accepted",
  }).select("venue");

  return bookedInquiries.map((inquiry) => inquiry.venue);
};

const addAvailabilityToVenues = async (venues, eventDate) => {
  if (!eventDate) {
    return venues;
  }

  const bookedVenueIds = await getBookedVenueIdsByDate(eventDate);

  const bookedVenueIdSet = new Set(
    bookedVenueIds.map((id) => id.toString())
  );

  const venuesWithAvailability = venues.map((venue) => {
    const venueObject =
      typeof venue.toObject === "function" ? venue.toObject() : venue;

    const isBooked = bookedVenueIdSet.has(venueObject._id.toString());

    return {
      ...venueObject,
      isBooked,
      isAvailable: !isBooked,
    };
  });

  venuesWithAvailability.sort((a, b) => {
    return Number(a.isBooked) - Number(b.isBooked);
  });

  return venuesWithAvailability;
};

/**
 * Builds the MongoDB filter object for venue listing.
 *
 * If no filters are provided, this still returns:
 * {
 *   status: "approved",
 *   isActive: true
 * }
 *
 * So GET /api/venues returns all approved active venues.
 */

const buildVenueFilter = async (query = {}) => {
  const {
    district,
    town,
    category,
    keyword,
    eventDate,
    minCapacity,
    maxPrice,
  } = query;

  const filter = {
    status: "approved",
    isActive: true,
  };

  if (district) {
    filter.district = {
      $regex: `^${escapeRegex(district)}$`,
      $options: "i",
    };
  }

  if (town) {
    filter.town = {
      $regex: escapeRegex(town),
      $options: "i",
    };
  }

  if (category) {
    filter.category = category;
  }

  if (minCapacity) {
    const capacityNumber = Number(minCapacity);

    if (Number.isNaN(capacityNumber)) {
      const error = new Error("minCapacity must be a number");
      error.statusCode = 400;
      throw error;
    }

    filter.capacity = {
      $gte: capacityNumber,
    };
  }

  if (maxPrice) {
    const priceNumber = Number(maxPrice);

    if (Number.isNaN(priceNumber)) {
      const error = new Error("maxPrice must be a number");
      error.statusCode = 400;
      throw error;
    }

    filter["pricing.basePrice"] = {
      $lte: priceNumber,
    };
  }

  if (keyword) {
    const safeKeyword = escapeRegex(keyword);

    filter.$or = [
      { name: { $regex: safeKeyword, $options: "i" } },
      { town: { $regex: safeKeyword, $options: "i" } },
      { district: { $regex: safeKeyword, $options: "i" } },
      { address: { $regex: safeKeyword, $options: "i" } },
    ];
  }

  return filter;
};


/**
 * Get all approved venues or filtered venues.
 */
export const getAvailableVenuesService = async (query = {}) => {
  const filter = await buildVenueFilter(query);

  const venues = await Venue.find(filter).sort({ createdAt: -1 });

  return addAvailabilityToVenues(venues, query.eventDate);
};
/**
 * Get one approved active venue by ID.
 */
export const getVenueByIdService = async (venueId) => {
  if (!mongoose.Types.ObjectId.isValid(venueId)) {
    const error = new Error("Invalid venue ID");
    error.statusCode = 400;
    throw error;
  }

  const venue = await Venue.findOne({
    _id: venueId,
    status: "approved",
    isActive: true,
  });

  if (!venue) {
    const error = new Error("Venue not found");
    error.statusCode = 404;
    throw error;
  }

  return venue;
};

/**
 * Get nearby approved venues using user's current location.
 *
 * Frontend sends:
 * lat = latitude
 * lng = longitude
 *
 * MongoDB needs:
 * coordinates: [longitude, latitude]
 */
export const getNearbyVenuesService = async (query = {}) => {
  const { lat, lng, maxDistance = 45000 } = query;

  if (lat === undefined || lng === undefined) {
    const error = new Error("lat and lng are required");
    error.statusCode = 400;
    throw error;
  }

  const latitude = Number(lat);
  const longitude = Number(lng);
  const distance = Number(maxDistance);

  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude) ||
    Number.isNaN(distance)
  ) {
    const error = new Error("lat, lng, and maxDistance must be numbers");
    error.statusCode = 400;
    throw error;
  }

  if (
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    const error = new Error("Invalid latitude or longitude values");
    error.statusCode = 400;
    throw error;
  }

  const filter = await buildVenueFilter(query);

  const venues = await Venue.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        distanceField: "distanceMeters",
        maxDistance: distance,
        spherical: true,
        query: filter,
      },
    },
    {
      $addFields: {
        distanceKm: {
          $round: [{ $divide: ["$distanceMeters", 1000] }, 1],
        },
      },
    },
    {
      $sort: {
        distanceMeters: 1,
      },
    },
  ]);

  return addAvailabilityToVenues(venues, query.eventDate);
};

export const getTownSuggestionsService = async (query = {}) => {
  const { district, keyword } = query;

  const filter = {
    status: "approved",
    isActive: true,
  };

  if (district) {
    filter.district = {
      $regex: `^${escapeRegex(district)}$`,
      $options: "i",
    };
  }

  if (keyword) {
    filter.town = {
      $regex: escapeRegex(keyword),
      $options: "i",
    };
  }

  const towns = await Venue.distinct("town", filter);

  return towns
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 10);
};