import { z } from 'zod';

export const availabilitySchemaDTO = z.object({
  openingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  closingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  availableDays: z.array(z.number().min(0).max(6)),
  minBookingDuration: z.number().min(1),
  maxBookingDuration: z.number().nullable().optional(),
  pricePerHour: z.number().min(0),
  bufferTime: z.number().min(0).default(0),
});

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

  availability: availabilitySchemaDTO.optional(),
});

// Automatically generate the TypeScript type!
export type CreateVenueDTO = z.infer<typeof createVenueSchema>;

