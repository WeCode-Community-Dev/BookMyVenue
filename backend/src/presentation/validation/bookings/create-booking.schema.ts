import z from 'zod';

export const createBookingSchema = z.object({
  venueId: z.string().uuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  guestsCount: z.number().int().positive(),
});
