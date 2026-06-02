import { z } from 'zod';

export const signupSchema = z
   .object({
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
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword']
   });