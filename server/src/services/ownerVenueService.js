import mongoose from "mongoose";
import Venue from "../models/Venue.js";

const allowedCategoryValues = [
  "banquet hall",
  "auditorium",
  "convention center",
  "outdoor",
  "rooftop",
  "resort",
  "hotel ballroom",
  "community hall",
  "wedding hall",
  "conference room",
];

const allowedPricingModels = ["per_day", "per_hour", "per_event"];

const validateObjectId = (id, message = "Invalid ID") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
  }
};

const buildVenueUpdateData = (venueData = {}) => {
  const updateData = {};

  if (venueData.name !== undefined) {
    updateData.name = venueData.name;
  }

  if (venueData.description !== undefined) {
    updateData.description = venueData.description;
  }

  if (venueData.category !== undefined) {
    const category = venueData.category.trim().toLowerCase();

    if (!allowedCategoryValues.includes(category)) {
      const error = new Error("Invalid venue category");
      error.statusCode = 400;
      throw error;
    }

    updateData.category = category;
  }

  if (venueData.district !== undefined) {
    updateData.district = venueData.district;
  }

  if (venueData.town !== undefined) {
    updateData.town = venueData.town;
  }

  if (venueData.address !== undefined) {
    updateData.address = venueData.address;
  }

  if (venueData.location !== undefined) {
    const coordinates = venueData.location?.coordinates;

    if (
      !Array.isArray(coordinates) ||
      coordinates.length !== 2 ||
      Number.isNaN(Number(coordinates[0])) ||
      Number.isNaN(Number(coordinates[1]))
    ) {
      const error = new Error(
        "Location coordinates must be [longitude, latitude]"
      );
      error.statusCode = 400;
      throw error;
    }

    updateData.location = {
      type: "Point",
      coordinates: [Number(coordinates[0]), Number(coordinates[1])],
    };
  }

  if (venueData.capacity !== undefined) {
    const capacity = Number(venueData.capacity);

    if (Number.isNaN(capacity) || capacity < 1) {
      const error = new Error("Capacity must be a valid number");
      error.statusCode = 400;
      throw error;
    }

    updateData.capacity = capacity;
  }

  if (venueData.pricing !== undefined) {
    const basePrice = Number(venueData.pricing?.basePrice);
    const pricingModel = venueData.pricing?.pricingModel || "per_day";

    if (Number.isNaN(basePrice) || basePrice < 0) {
      const error = new Error("Starting price must be a valid number");
      error.statusCode = 400;
      throw error;
    }

    if (!allowedPricingModels.includes(pricingModel)) {
      const error = new Error("Invalid pricing model");
      error.statusCode = 400;
      throw error;
    }

    updateData.pricing = {
      basePrice,
      currency: venueData.pricing?.currency || "INR",
      pricingModel,
    };
  }

  if (venueData.amenities !== undefined) {
    if (!Array.isArray(venueData.amenities)) {
      const error = new Error("Amenities must be an array");
      error.statusCode = 400;
      throw error;
    }

    updateData.amenities = venueData.amenities;
  }

  if (venueData.images !== undefined) {
    if (!Array.isArray(venueData.images)) {
      const error = new Error("Images must be an array");
      error.statusCode = 400;
      throw error;
    }

    updateData.images = venueData.images;
  }

  if (venueData.contactInfo !== undefined) {
    updateData.contactInfo = {
      phone: venueData.contactInfo?.phone || "",
      email: venueData.contactInfo?.email || "",
      website: venueData.contactInfo?.website || "",
    };
  }

  return updateData;
};

export const createOwnerVenueService = async ({ ownerId, venueData }) => {
  const venue = await Venue.create({
    ...venueData,
    owner: ownerId,
    status: "pending",
    isActive: true,
    isSeed: false,
  });

  return venue;
};

export const getOwnerVenuesService = async (ownerId) => {
  const venues = await Venue.find({
    owner: ownerId,
  }).sort({ createdAt: -1 });

  return venues;
};

export const getOwnerVenueByIdService = async ({ ownerId, venueId }) => {
  validateObjectId(venueId, "Invalid venue ID");

  const venue = await Venue.findOne({
    _id: venueId,
    owner: ownerId,
  });

  if (!venue) {
    const error = new Error("Venue not found");
    error.statusCode = 404;
    throw error;
  }

  return venue;
};

export const updateOwnerVenueService = async ({
  ownerId,
  venueId,
  venueData,
}) => {
  validateObjectId(venueId, "Invalid venue ID");

  const existingVenue = await Venue.findOne({
    _id: venueId,
    owner: ownerId,
  });

  if (!existingVenue) {
    const error = new Error("Venue not found");
    error.statusCode = 404;
    throw error;
  }

  const updateData = buildVenueUpdateData(venueData);

  updateData.status = "pending";
  updateData.isSeed = false;

  const updatedVenue = await Venue.findOneAndUpdate(
    {
      _id: venueId,
      owner: ownerId,
    },
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedVenue;
};