import { ownerService } from '../services/ownerService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const ownerController = {
  listBookings: asyncHandler(async (req, res) => {
    const bookings = await ownerService.listVenueBookings(req.user.id);
    res.json({ success: true, data: { bookings } });
  }),
};
