import { z } from 'zod';

const baseSchema = {

   name: z
      .string()
      .min(3, 'Name must be at least 3 characters'),

   email: z
      .email('Invalid email address'),

   phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits'),

   password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),

   confirmPassword: z.string()

};

export const userSignupSchema = z
   .object(baseSchema)
   .refine(
      (data) => data.password === data.confirmPassword,
      {
         message: 'Passwords do not match',
         path: ['confirmPassword']
      }
   );

export const ownerSignupSchema = z
   .object({

      ...baseSchema,

      venueName: z
         .string()
         .min(3, 'Venue name is required'),

      venueType: z
         .string()
         .min(1, 'Venue type is required'),

      city: z
         .string()
         .min(2, 'City is required')

   })
   .refine(
      (data) => data.password === data.confirmPassword,
      {
         message: 'Passwords do not match',
         path: ['confirmPassword']
      }
   );