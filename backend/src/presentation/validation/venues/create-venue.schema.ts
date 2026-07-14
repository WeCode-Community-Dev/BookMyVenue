import z from 'zod';

export const createVenueSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  venueType: z.string().min(1),
  addressLine1: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postalCode: z.string().min(1),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  capacity: z.number().int().positive(),
  pricePerDay: z.number().positive(),
});
