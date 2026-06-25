import VenueModel from "../models/venue.model";
import { ForbiddenException, NotFoundException } from "../utils/appError";
import { RoleEnum, RoleEnumType } from "../enums/user-enum";
import { CreateVenueInput, UpdateVenueInput } from "../validator/venue.validator";

type CreateVenueParams = CreateVenueInput & {
  owner: string;
};

type UpdateVenueParams = {
  venueId: string;
  userId: string;
  role: RoleEnumType;
  data: UpdateVenueInput;
};

export const createVenueService = async (data: CreateVenueParams) => {
  const venue = await VenueModel.create(data);
  return venue;
};

export const getVenueByIdService = async (venueId: string) => {
  const venue = await VenueModel.findById(venueId);
  if (!venue) {
    throw new NotFoundException("Venue not found");
  }

  return venue;
};

export const updateVenueService = async ({ venueId, userId, role, data }: UpdateVenueParams) => {
  const venue = await VenueModel.findById(venueId);
  if (!venue) {
    throw new NotFoundException("Venue not found");
  }

  // Owners can only update their own venue and admin can update any venue.
  const isOwner = venue.owner.toString() === userId;
  const isAdmin = role === RoleEnum.ADMIN;
  if (!isOwner && !isAdmin) {
    throw new ForbiddenException("You can only update your own venue");
  }

  Object.assign(venue, data);
  await venue.save();

  return venue;
};
