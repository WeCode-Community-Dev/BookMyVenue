import * as availabilityRepository from '@/repositories/availability.repository';
import * as venueRepository from '@/repositories/venue.repository';
import { UpdateAvailabilityDTO } from '@/dto/availability/update-availability.dto';
import { AppError } from '@/utils/AppError';
import { HTTP_STATUS } from '@/constants/http';

export const getAvailability = async (ownerId: string, venueId: string) => {
  const venue = await venueRepository.findVenueById(venueId);

  if (!venue) {
    throw new AppError('Venue not found', HTTP_STATUS.NOT_FOUND);
  }

  if (venue.ownerId.toString() !== ownerId) {
    throw new AppError('Unauthorized access to this venue', HTTP_STATUS.FORBIDDEN);
  }

  return await availabilityRepository.getAvailabilityByVenueId(venueId);
};

export const createAvailability = async (
  ownerId: string,
  venueId: string,
  data: UpdateAvailabilityDTO
) => {
  const venue = await venueRepository.findVenueById(venueId);

  if (!venue) {
    throw new AppError('Venue not found', HTTP_STATUS.NOT_FOUND);
  }

  if (venue.ownerId.toString() !== ownerId) {
    throw new AppError('Unauthorized access to this venue', HTTP_STATUS.FORBIDDEN);
  }

  if (venue.verificationStatus !== 'approved') {
    throw new AppError(
      'Venue must be approved before configuring availability',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (venue.isDeleted) {
    throw new AppError(
      'Cannot configure availability for a deleted venue',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const existingAvailability = await availabilityRepository.getAvailabilityByVenueId(venueId);
  if (existingAvailability) {
    throw new AppError(
      'Availability configuration already exists for this venue',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  return await availabilityRepository.createAvailability(venueId, data);
};

export const updateAvailability = async (
  ownerId: string,
  venueId: string,
  data: UpdateAvailabilityDTO
) => {
  const venue = await venueRepository.findVenueById(venueId);

  if (!venue) {
    throw new AppError('Venue not found', HTTP_STATUS.NOT_FOUND);
  }

  if (venue.ownerId.toString() !== ownerId) {
    throw new AppError('Unauthorized access to this venue', HTTP_STATUS.FORBIDDEN);
  }

  if (venue.verificationStatus !== 'approved') {
    throw new AppError(
      'Venue must be approved before configuring availability',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (venue.isDeleted) {
    throw new AppError(
      'Cannot configure availability for a deleted venue',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const availability = await availabilityRepository.updateAvailability(venueId, data);

  if (!availability) {
    throw new AppError('Availability configuration not found for update', HTTP_STATUS.NOT_FOUND);
  }

  return availability;
};
