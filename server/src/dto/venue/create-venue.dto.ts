import { z } from 'zod';

export const createVenueSchema = z.object({
  name: z.string().min(2),

  description: z.string().min(1),

  categoryId: z.string(),

  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    district: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1),
  }),

  location: z.object({
    type: z.literal('Point').default('Point'),
    coordinates: z.tuple([
      z.number(), // longitude
      z.number(), // latitude
    ]),
  }),

  capacity: z.number().positive(),

  images: z.array(z.string()).optional(),

  amenities: z.array(z.string()).optional(),
});

// Automatically generate the TypeScript type!
export type CreateVenueDTO = z.infer<typeof createVenueSchema>;
