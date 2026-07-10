import { z } from 'zod';

export const updateVenueSchema = z.object({
  name: z.string().min(2).optional(),

  description: z.string().min(1).optional(),

  categoryId: z.string().optional(),

  address: z
    .object({
      street: z.string().min(1),
      city: z.string().min(1),
      district: z.string().min(1),
      state: z.string().min(1),
      pincode: z.string().min(1),
    })
    .optional(),

  location: z
    .object({
      type: z.literal('Point').default('Point'),
      coordinates: z.tuple([
        z.number(), // longitude
        z.number(), // latitude
      ]),
    })
    .optional(),

  capacity: z.number().positive().optional(),

  images: z.array(z.string()).optional(),
  existingImages: z.string().optional(),
  amenities: z.array(z.string()).optional(),
});

// Automatically generate the TypeScript type!
export type UpdateVenueDTO = z.infer<typeof updateVenueSchema>;
