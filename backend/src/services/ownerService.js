import { toPublicOwnerBooking } from '../utils/bookingMapper.js';
import { bookingRepository } from '../repositories/bookingRepository.js';

export const ownerService = {
  async listVenueBookings(ownerId) {
    const bookings = await bookingRepository.findByOwnerId(ownerId);
    return bookings.map(toPublicOwnerBooking);
  },
};
