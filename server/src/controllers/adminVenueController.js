import {
  getAdminVenuesService,
  updateVenueApprovalStatusService,
} from "../services/adminVenueService.js";

export const getAdminVenues = async (req, res) => {
  try {
    const venues = await getAdminVenuesService(req.query);

    res.status(200).json({
      success: true,
      count: venues.length,
      data: venues,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch venues",
    });
  }
};

export const updateVenueApprovalStatus = async (req, res) => {
  try {
    const venue = await updateVenueApprovalStatusService({
      venueId: req.params.id,
      status: req.body.status,
    });

    res.status(200).json({
      success: true,
      message: `Venue ${req.body.status} successfully`,
      data: venue,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update venue status",
    });
  }
};