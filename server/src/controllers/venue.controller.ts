import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { BadRequestException, UnauthorizedException } from "../utils/appError";
import { RoleEnumType } from "../enums/user-enum";
import {
  createVenueService,
  getVenuesService,
  getMyVenuesService,
  getAllVenuesService,
  getVenueByIdService,
  setVenueApprovalService,
  updateVenueService,
  deleteVenueService,
} from "../services/venue.service";
import {
  createVenueSchema,
  updateVenueSchema,
  listVenuesSchema,
} from "../validator/venue.validator";

export const getVenuesController = asyncHandler(async (req: Request, res: Response) => {
  const query = listVenuesSchema.parse(req.query);

  const result = await getVenuesService(query);

  return res.status(HTTP_STATUS.OK).json({
    message: "Venues fetched successfully",
    ...result,
  });
});

export const getMyVenuesController = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user?.userId;
  if (!ownerId) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const venues = await getMyVenuesService(ownerId);

  return res.status(HTTP_STATUS.OK).json({
    message: "Venues fetched successfully",
    venues,
  });
});

export const getAllVenuesController = asyncHandler(async (_req: Request, res: Response) => {
  const venues = await getAllVenuesService();

  return res.status(HTTP_STATUS.OK).json({
    message: "Venues fetched successfully",
    venues,
  });
});

export const createVenueController = asyncHandler(async (req: Request, res: Response) => {
  const owner = req.user?.userId;
  if (!owner) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const data = createVenueSchema.parse(req.body);

  const venue = await createVenueService({ owner, ...data });

  return res.status(HTTP_STATUS.CREATED).json({
    message: "Venue created successfully",
    venue,
  });
});

export const approveVenueController = asyncHandler(async (req: Request, res: Response) => {
  const venueId = req.params.venueId;
  if (typeof venueId !== "string" || !isValidObjectId(venueId)) {
    throw new BadRequestException("Invalid venue id");
  }

  const isApproved = typeof req.body?.isApproved === "boolean" ? req.body.isApproved : true;

  const venue = await setVenueApprovalService(venueId, isApproved);

  return res.status(HTTP_STATUS.OK).json({
    message: isApproved ? "Venue approved successfully" : "Venue moved to pending",
    venue,
  });
});

export const getVenueByIdController = asyncHandler(async (req: Request, res: Response) => {
  const venueId = req.params.venueId;
  if (typeof venueId !== "string" || !isValidObjectId(venueId)) {
    throw new BadRequestException("Invalid venue id");
  }

  const venue = await getVenueByIdService(venueId);

  return res.status(HTTP_STATUS.OK).json({
    message: "Venue fetched successfully",
    venue,
  });
});

export const updateVenueController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  if (!userId || !role) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const venueId = req.params.venueId;
  if (typeof venueId !== "string" || !isValidObjectId(venueId)) {
    throw new BadRequestException("Invalid venue id");
  }

  const data = updateVenueSchema.parse(req.body);

  const venue = await updateVenueService({
    venueId,
    userId,
    role: role as RoleEnumType,
    data,
  });

  return res.status(HTTP_STATUS.OK).json({
    message: "Venue updated successfully",
    venue,
  });
});

export const deleteVenueController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  if (!userId || !role) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const venueId = req.params.venueId;
  if (typeof venueId !== "string" || !isValidObjectId(venueId)) {
    throw new BadRequestException("Invalid venue id");
  }

  await deleteVenueService({
    venueId,
    userId,
    role: role as RoleEnumType,
  });

  return res.status(HTTP_STATUS.OK).json({
    message: "Venue deleted successfully",
  });
});
