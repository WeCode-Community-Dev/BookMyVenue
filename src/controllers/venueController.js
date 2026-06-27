import { venueService } from '../services/venueService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const venueController = {
  list: asyncHandler(async (req, res) => {
    const city = req.query.city?.trim() || undefined;
    const venues = await venueService.listVenues(city);
    res.json({ success: true, data: { venues } });
  }),

  getById: asyncHandler(async (req, res) => {
    const venue = await venueService.getVenueById(Number(req.params.id));
    res.json({ success: true, data: { venue } });
  }),

  create: asyncHandler(async (req, res) => {
    const venue = await venueService.createVenue(req.user.id, req.body);
    res.status(201).json({ success: true, data: { venue } });
  }),

  update: asyncHandler(async (req, res) => {
    const venue = await venueService.updateVenue(
      Number(req.params.id),
      req.user.id,
      req.body,
    );
    res.json({ success: true, data: { venue } });
  }),

  remove: asyncHandler(async (req, res) => {
    await venueService.deleteVenue(Number(req.params.id), req.user.id);
    res.json({ success: true, data: { message: 'Venue deleted' } });
  }),
};
