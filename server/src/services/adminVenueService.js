import mongoose from "mongoose";
import Venue from "../models/Venue.js";

export const getAdminVenuesService = async (query = {}) => {
  const { status } = query;

  const filter = {};

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    filter.status = status;
  }

  const venues = await Venue.find(filter)
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  return venues;
};

export const updateVenueApprovalStatusService = async ({ venueId, status }) => {
  if (!mongoose.Types.ObjectId.isValid(venueId)) {
    const error = new Error("Invalid venue ID");
    error.statusCode = 400;
    throw error;
  }

  if (!["approved", "rejected"].includes(status)) {
    const error = new Error("Status must be approved or rejected");
    error.statusCode = 400;
    throw error;
  }

  const venue = await Venue.findById(venueId);

  if (!venue) {
    const error = new Error("Venue not found");
    error.statusCode = 404;
    throw error;
  }

  venue.status = status;

  await venue.save();

  return venue;
};