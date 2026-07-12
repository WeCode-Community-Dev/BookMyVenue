import {
  createOwnerVenueService,
  getOwnerVenuesService,
  getOwnerVenueByIdService,
  updateOwnerVenueService,
} from "../services/ownerVenueService.js";

export const createOwnerVenue = async (req, res) => {
  try {
    const venue = await createOwnerVenueService({
      ownerId: req.user._id,
      venueData: req.body,
    });

    res.status(201).json({
      success: true,
      message: "Venue submitted successfully. Waiting for admin approval.",
      data: venue,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to submit venue",
    });
  }
};

export const getOwnerVenues = async (req, res) => {
  try {
    const venues = await getOwnerVenuesService(req.user._id);

    res.status(200).json({
      success: true,
      count: venues.length,
      data: venues,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch owner venues",
    });
  }
};

export const getOwnerVenueById = async (req, res) => {
  try {
    const venue = await getOwnerVenueByIdService({
      ownerId: req.user._id,
      venueId: req.params.id,
    });

    res.status(200).json({
      success: true,
      data: venue,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch venue",
    });
  }
};

export const updateOwnerVenue = async (req, res) => {
  try {
    const venue = await updateOwnerVenueService({
      ownerId: req.user._id,
      venueId: req.params.id,
      venueData: req.body,
    });

    res.status(200).json({
      success: true,
      message: "Venue updated successfully. Waiting for admin approval.",
      data: venue,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update venue",
    });
  }
};