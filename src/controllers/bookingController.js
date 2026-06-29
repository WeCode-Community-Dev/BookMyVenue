import { bookingService } from '../services/bookingService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const bookingController = {
  create: asyncHandler(async (req, res) => {
    const booking = await bookingService.createBooking(req.user.id, req.body);
    res.status(201).json({ success: true, data: { booking } });
  }),

  listMine: asyncHandler(async (req, res) => {
    const bookings = await bookingService.listMyBookings(req.user.id);
    res.json({ success: true, data: { bookings } });
  }),

  cancel: asyncHandler(async (req, res) => {
    const booking = await bookingService.cancelBooking(
      Number(req.params.id),
      req.user.id,
    );
    res.json({ success: true, data: { booking } });
  }),

  availability: asyncHandler(async (req, res) => {
    const availability = await bookingService.getVenueAvailability(
      Number(req.params.id),
      req.query.from,
      req.query.to,
    );
    res.json({ success: true, data: availability });
  }),
};
