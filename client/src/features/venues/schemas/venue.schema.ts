import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const indianPincodeRegex = /^[1-9][0-9]{5}$/;

export const venueSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'Venue name must be at least 3 characters')
      .max(100, 'Venue name cannot exceed 100 characters')
      .refine((value) => value.replace(/\s/g, '').length >= 3, 'Venue name is too short'),

    categoryId: z.string().regex(objectIdRegex, 'Please select a valid category'),

    description: z
      .string()
      .trim()
      .min(50, 'Description should contain at least 50 characters')
      .max(1500, 'Description cannot exceed 1500 characters'),

    street: z
      .string()
      .trim()
      .min(5, 'Street address is required')
      .max(150, 'Street address is too long'),

    city: z.string().trim().min(2, 'City is required').max(50, 'City name is too long'),

    district: z.string().trim().min(2, 'District is required').max(50, 'District name is too long'),

    state: z.string().trim().min(2, 'State is required').max(50, 'State name is too long'),

    pincode: z.string().trim().regex(indianPincodeRegex, 'Enter a valid 6-digit PIN code'),

    latitude: z
      .number()
      .min(-90, 'Latitude must be between -90 and 90')
      .max(90, 'Latitude must be between -90 and 90'),

    longitude: z
      .number()
      .min(-180, 'Longitude must be between -180 and 180')
      .max(180, 'Longitude must be between -180 and 180'),

    capacity: z
      .number()
      .int('Capacity must be a whole number')
      .min(1, 'Capacity must be at least 1')
      .max(50000, 'Capacity cannot exceed 50,000'),

    amenities: z
      .array(
        z.string().trim().min(2, 'Amenity name is too short').max(50, 'Amenity name is too long')
      )
      .max(30, 'Maximum 30 amenities allowed')
      .optional(),

    images: z
      .array(z.string().url('Invalid image URL'))
      .min(1, 'At least one image is required')
      .max(10, 'Maximum 10 images allowed')
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Kerala sanity check (optional)
    if (
      data.latitude !== undefined &&
      data.longitude !== undefined &&
      (data.latitude === 0 || data.longitude === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['latitude'],
        message: 'Location coordinates appear invalid',
      });
    }
  });

export type FormValues = z.infer<typeof venueSchema>;
