import { STATUS_CODES } from "../../shared/constants/statusCodes.js";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../../shared/constants/messages.js";
import ApiResponse from "../../shared/utils/apiResponse.js";
import {
  deleteVenueService,
  getVenueByIdService,
  getVenuesService,
  registerVenueService,
  updateVenueService,
} from "./venues.service.js";

export const registerVenue = async (req, res, next) => {
  console.log("USER:", req.user.userId);
  try {
    const venue = await registerVenueService(req.body, req.user.userId);
    return res
      .status(STATUS_CODES.CREATED)
      .json(
        new ApiResponse(
          STATUS_CODES.CREATED,
          SUCCESS_MESSAGES.VENUE_REGISTERED,
          venue,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const getVenues = async (req, res, next) => {
  try {
    const venues = await getVenuesService();
    return res
      .status(STATUS_CODES.OK)
      .json(
        new ApiResponse(
          STATUS_CODES.OK,
          SUCCESS_MESSAGES.VENUES_RETRIEVED,
          venues,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const getVenueById = async (req, res, next) => {
  try {
    const venue = await getVenueByIdService(req.params.id);
    if (!venue) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json(
          new ApiResponse(
            STATUS_CODES.NOT_FOUND,
            ERROR_MESSAGES.VENUE_NOT_FOUND,
          ),
        );
    }
    return res
      .status(STATUS_CODES.OK)
      .json(
        new ApiResponse(
          STATUS_CODES.OK,
          SUCCESS_MESSAGES.VENUE_RETRIEVED,
          venue,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const updateVenue = async (req, res, next) => {
  try {
    const updatedVenue = await updateVenueService(req.params.id, req.body);
    if (!updatedVenue) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json(
          new ApiResponse(
            STATUS_CODES.NOT_FOUND,
            ERROR_MESSAGES.VENUE_NOT_FOUND,
          ),
        );
    }
    return res
      .status(STATUS_CODES.OK)
      .json(
        new ApiResponse(
          STATUS_CODES.OK,
          SUCCESS_MESSAGES.VENUE_UPDATED,
          updatedVenue,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const deleteVenue = async (req, res, next) => {
  try {
    const deleted = await deleteVenueService(req.params.id);
    if (!deleted) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json(
          new ApiResponse(
            STATUS_CODES.NOT_FOUND,
            ERROR_MESSAGES.VENUE_NOT_FOUND,
          ),
        );
    }

    return res
      .status(STATUS_CODES.OK)
      .json(new ApiResponse(STATUS_CODES.OK, SUCCESS_MESSAGES.VENUE_DELETED));
  } catch (error) {
    next(error);
  }
};
