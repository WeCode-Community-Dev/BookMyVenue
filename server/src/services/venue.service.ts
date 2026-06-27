import VenueModel from "../models/venue.model";
import { ForbiddenException, NotFoundException } from "../utils/appError";
import { RoleEnum, RoleEnumType } from "../enums/user-enum";
import { CreateVenueInput, UpdateVenueInput, ListVenuesInput } from "../validator/venue.validator";

type CreateVenueParams = CreateVenueInput & {
  owner: string;
};

type UpdateVenueParams = {
  venueId: string;
  userId: string;
  role: RoleEnumType;
  data: UpdateVenueInput;
};

type DeleteVenueParams = {
  venueId: string;
  userId: string;
  role: RoleEnumType;
};

export const createVenueService = async (data: CreateVenueParams) => {
  const venue = await VenueModel.create(data);
  return venue;
};

export const getVenuesService = async ({ page, limit, city, venueType }: ListVenuesInput) => {
  const filter: Record<string, unknown> = { isApproved: true };
  if (city) {
    const escaped = city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.city = { $regex: escaped, $options: "i" };
  }
  if (venueType) filter.venueType = venueType;

  const skip = (page - 1) * limit;

  const [venues, total] = await Promise.all([
    VenueModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    VenueModel.countDocuments(filter),
  ]);

  return {
    venues,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getMyVenuesService = async (ownerId: string) => {
  return VenueModel.find({ owner: ownerId }).sort({ createdAt: -1 });
};

export const approveVenueService = async (venueId: string) => {
  const venue = await VenueModel.findById(venueId);
  if (!venue) {
    throw new NotFoundException("Venue not found");
  }

  venue.isApproved = true;
  await venue.save();

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

export const deleteVenueService = async ({ venueId, userId, role }: DeleteVenueParams) => {
  const venue = await VenueModel.findById(venueId);
  if (!venue) {
    throw new NotFoundException("Venue not found");
  }

  const isOwner = venue.owner.toString() === userId;
  const isAdmin = role === RoleEnum.ADMIN;
  if (!isOwner && !isAdmin) {
    throw new ForbiddenException("You can only delete your own venue");
  }

  await venue.deleteOne();

  return venue;
};
