import z from 'zod';

export const resendOtpSchema = z.object({
  verificationToken: z.string().trim().min(1, 'Token is required').max(512, 'Invalid token'),
});

export type ResendOtpDto = z.infer<typeof resendOtpSchema>;
