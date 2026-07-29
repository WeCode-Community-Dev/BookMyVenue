import { z } from 'zod';

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, 'Full name must be at least 3 characters long')
      .max(100, 'Full name cannot exceed 100 characters')
      .regex(
        /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,
        'Full name can only contain letters, spaces, hyphens, and apostrophes'
      ),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Invalid email address')
      .max(254, 'Email is too long'),

    phoneNumber: z
      .string()
      .trim()
      .regex(/^\+?[1-9]\d{7,14}$/, 'Phone number must be a valid international number'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password cannot exceed 128 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/,
        'Password must contain at least one special character'
      )
      .regex(/^\S*$/, 'Password cannot contain spaces'),

    confirmPassword: z.string(),

    role: z.enum(['user', 'owner', 'admin']).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterDto = z.infer<typeof signupSchema>;
