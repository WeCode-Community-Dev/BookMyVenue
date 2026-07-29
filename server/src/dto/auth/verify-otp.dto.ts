import { z } from 'zod';

export const verifyOtpSchema = z.object({
  verificationToken: z.string().trim().min(1, 'Token is required').max(512, 'Invalid token'),

  otp: z
    .string()
    .trim()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain exactly 6 numeric digits'),
});

export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;
