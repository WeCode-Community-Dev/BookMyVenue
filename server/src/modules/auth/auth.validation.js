import { z } from 'zod';

export const signupSchema = z.object({
   name: z.string().min(3, 'Name must be at least 3 characters'),

   email: z.email('Invalid email'),

   phone: z.string().min(10, 'Phone number is invalid'),

   password: z.string().min(8, 'Password must be at least 8 characters')
});