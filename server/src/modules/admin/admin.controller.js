import {
    updateVenueStatusService
  } from "./admin.service.js";
export const updateVenueStatusController =
  async (req, res, next) => {
    try {

      const venue =
        await updateVenueStatusService(
          req.params.id,
          req.body.status
        );

      res.json({
        success: true,
        data: venue,
      });

    } catch (error) {
      next(error);
    }
  };