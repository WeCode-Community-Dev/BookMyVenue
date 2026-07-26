import * as venueRepository from '@/repositories/venue.repository';
import { CreateVenueDTO } from '@/dto/venue/create-venue.dto';
import { UpdateVenueDTO } from '@/dto/venue/update-venue.dto';
import { GetOwnerVenuesQueryDTO } from '@/dto/venue/get-owner-venues.dto';
import { GetAdminVenuesQueryDTO } from '@/dto/admin/get-venues.dto';
import { GetPublicVenuesQueryDTO } from '@/dto/venue/get-public-venues.dto';
import { VenueDocument } from '@/types/venue.types';
import { AppError } from '@/utils/AppError';
import { HTTP_STATUS } from '@/constants/http';
import { MESSAGES } from '@/constants/messages';

type Return = Promise<VenueDocument>;

export const createVenue = async (id: string, data: CreateVenueDTO): Return => {
  return await venueRepository.createVenue(id, data);
};

export const getOwnerVenues = async (ownerId: string, query: GetOwnerVenuesQueryDTO) => {
  return await venueRepository.findVenuesByOwner(ownerId, query);
};

export const getVenueById = async (ownerId: string, venueId: string): Return => {
  const venue = await venueRepository.findVenueById(venueId);

  if (!venue) {
    throw new AppError(MESSAGES.VENUE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // Ensure the owner can only access their own venues
  if (venue.ownerId.toString() !== ownerId) {
    throw new AppError(MESSAGES.FORBIDDEN_VENUE_ACCESS, HTTP_STATUS.FORBIDDEN);
  }

  return venue;
};

export const updateVenue = async (
  ownerId: string,
  venueId: string,
  data: UpdateVenueDTO
): Return => {
  const venue = await venueRepository.findVenueById(venueId);

  if (!venue) {
    throw new AppError(MESSAGES.VENUE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // Ensure the owner can only update their own venues
  if (venue.ownerId.toString() !== ownerId) {
    throw new AppError(MESSAGES.FORBIDDEN_VENUE_ACCESS, HTTP_STATUS.FORBIDDEN);
  }

  // If an approved venue is edited, reset status back to pending
  if (venue.verificationStatus === 'approved') {
    (data as any).verificationStatus = 'pending';
    (data as any).verifiedAt = null;
  }

  const updatedVenue = await venueRepository.updateVenue(venueId, data);

  if (!updatedVenue) {
    throw new AppError(MESSAGES.VENUE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return updatedVenue;
};

import Booking from '@/models/booking.model';
import { BookingStatus } from '@/constants/booking';

export const softDeleteVenue = async (ownerId: string, venueId: string): Return => {
  const venue = await venueRepository.findVenueById(venueId);

  if (!venue) {
    throw new AppError(MESSAGES.VENUE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (venue.ownerId.toString() !== ownerId) {
    throw new AppError(MESSAGES.FORBIDDEN_VENUE_ACCESS, HTTP_STATUS.FORBIDDEN);
  }

  // Check for active upcoming bookings
  const activeBookingsCount = await Booking.countDocuments({
    venue: venueId,
    bookingStatus: { $in: [BookingStatus.RESERVED, BookingStatus.CONFIRMED] },
    startDateTime: { $gte: new Date() },
  });

  if (activeBookingsCount > 0) {
    throw new AppError(
      `Cannot delete venue with ${activeBookingsCount} active upcoming booking(s). Please fulfill or cancel existing bookings first.`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const deletedVenue = await venueRepository.softDeleteVenue(venueId);
  if (!deletedVenue) throw new AppError(MESSAGES.VENUE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  return deletedVenue;
};

export const restoreVenue = async (ownerId: string, venueId: string): Return => {
  const venue = await venueRepository.findVenueById(venueId);

  if (!venue) {
    throw new AppError(MESSAGES.VENUE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (venue.ownerId.toString() !== ownerId) {
    throw new AppError(MESSAGES.FORBIDDEN_VENUE_ACCESS, HTTP_STATUS.FORBIDDEN);
  }

  const restoredVenue = await venueRepository.restoreVenue(venueId);
  if (!restoredVenue) throw new AppError(MESSAGES.VENUE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  return restoredVenue;
};

// ── Admin Methods ──────────────────────────────────────────

export const getAllVenuesForAdmin = async (query: GetAdminVenuesQueryDTO) => {
  return await venueRepository.findAllVenues(query);
};

export const getVenueByIdForAdmin = async (venueId: string): Return => {
  const venue = await venueRepository.findVenueByIdWithOwner(venueId);

  if (!venue) {
    throw new AppError(MESSAGES.VENUE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return venue;
};

export const approveVenue = async (venueId: string): Return => {
  const venue = await venueRepository.findVenueById(venueId);

  if (!venue) {
    throw new AppError(MESSAGES.VENUE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const approvedVenue = await venueRepository.approveVenue(venueId);
  if (!approvedVenue) throw new AppError(MESSAGES.VENUE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  return approvedVenue;
};

export const rejectVenue = async (venueId: string, rejectionReason: string): Return => {
  const venue = await venueRepository.findVenueById(venueId);

  if (!venue) {
    throw new AppError(MESSAGES.VENUE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const rejectedVenue = await venueRepository.rejectVenue(venueId, rejectionReason);
  if (!rejectedVenue) throw new AppError(MESSAGES.VENUE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

  return rejectedVenue;
};

// ── Public Methods ─────────────────────────────────────────

export const getPublicVenues = async (query: GetPublicVenuesQueryDTO) => {
  return await venueRepository.findPublicVenues(query);
};

export const getPublicVenueById = async (venueId: string): Return => {
  const venue = await venueRepository.findPublicVenueById(venueId);

  if (!venue) {
    throw new AppError(MESSAGES.VENUE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return venue;
};

export const toggleVenueFeaturedService = async (venueId: string, isFeatured: boolean): Return => {
  const venue = await venueRepository.findVenueById(venueId);
  if (!venue) {
    throw new AppError(MESSAGES.VENUE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  venue.isFeatured = isFeatured;
  await venue.save();
  return venue;
};

export const toggleVenueEliteService = async (venueId: string, isElite: boolean): Return => {
  const venue = await venueRepository.findVenueById(venueId);
  if (!venue) {
    throw new AppError(MESSAGES.VENUE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  venue.isElite = isElite;
  await venue.save();
  return venue;
};
