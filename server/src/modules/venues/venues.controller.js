import { STATUS_CODES } from "../../shared/constants/statusCodes.js";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../../shared/constants/messages.js";
import ApiResponse from "../../shared/utils/apiResponse.js";
import ApiError from "../../shared/utils/apiError.js";
import {
  deleteVenueService,
  getVenueByIdService,
  getVenuesService,
  createVenueService,
  updateVenueService,
  getMyVenuesService
} from "./venues.service.js";

export const createVenue = async (req, res, next) => {
  console.log("USER:", req.user.userId);
  try {
    const venue = await createVenueService(req.body, req.user.userId);
    return res
      .status(STATUS_CODES.CREATED)
      .json(
        new ApiResponse(
          STATUS_CODES.CREATED,
          SUCCESS_MESSAGES.VENUE_CREATED,
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
      throw new ApiError(

        STATUS_CODES.NOT_FOUND,
  
        ERROR_MESSAGES.VENUE_NOT_FOUND
  
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
    const updatedVenue = await updateVenueService(
      req.params.id,
      req.body,
      req.user.userId
    );

    if (!updatedVenue) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.VENUE_NOT_FOUND
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
    const deleted = await deleteVenueService(
      req.params.id,
      req.user.userId
    );
    if (!deleted) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        ERROR_MESSAGES.VENUE_NOT_FOUND
      );
    }

    return res
      .status(STATUS_CODES.OK)
      .json(new ApiResponse(STATUS_CODES.OK, SUCCESS_MESSAGES.VENUE_DELETED));
  } catch (error) {
    next(error);
  }
};

export const getMyVenues = async (
  req,
  res,
  next
) => {
  try {
    const venues =
      await getMyVenuesService(
        req.user.userId
      );

    return res
      .status(STATUS_CODES.OK)
      .json(
        new ApiResponse(
          STATUS_CODES.OK,
          SUCCESS_MESSAGES.VENUES_RETRIEVED,
          venues
        )
      );
  } catch (error) {
    next(error);
  }
};