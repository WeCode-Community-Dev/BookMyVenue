import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().trim().min(3).max(30),
  email: z.email('Invalid email Format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
    .max(100),
});

export const loginSchema = z
  .object({
    username: z.string().trim().min(3).max(30).optional(),
    email: z.email('Invalid email Format').optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      )
      .max(100),
  })
  .refine((data) => data.username ?? data.email, {
    message: 'Either username or email is required',
    path: ['username', 'email'],
  });

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email format'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
    .max(100),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
    .max(100),
});

export const sessionIdParamSchema = z.object({
  sessionId: z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, 'Invalid session ID'),
});
