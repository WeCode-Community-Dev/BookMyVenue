import Availability from '@/models/availability.model';
import Venue from '@/models/venue.model';
import { IAvailability } from '@/types/availability.types';
import { UpdateAvailabilityDTO } from '@/dto/availability/update-availability.dto';

export const getAvailabilityByVenueId = async (venueId: string): Promise<IAvailability | null> => {
  return await Availability.findOne({ venueId });
};

export const createAvailability = async (
  venueId: string,
  data: UpdateAvailabilityDTO
): Promise<IAvailability> => {
  const newAvailability = new Availability({
    venueId,
    ...data,
  });

  const savedAvailability = await newAvailability.save();

  await Venue.findByIdAndUpdate(venueId, { isAvailabilityConfigured: true });

  return savedAvailability;
};

export const updateAvailability = async (
  venueId: string,
  data: UpdateAvailabilityDTO
): Promise<IAvailability | null> => {
  const updatedAvailability = await Availability.findOneAndUpdate(
    { venueId },
    { $set: data },
    { new: true, runValidators: true }
  );

  return updatedAvailability;
};
