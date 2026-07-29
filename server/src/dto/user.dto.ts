import { z } from 'zod';

export const withdrawSchema = z.object({
  body: z.object({
    amount: z.number().positive('Withdrawal amount must be greater than 0').max(500000, 'Single withdrawal cap exceeded'),
    bankDetails: z.object({
      accountHolderName: z.string().min(2, 'Account holder name is required').max(100),
      accountNumber: z.string().regex(/^\d{9,18}$/, 'Account number must be between 9 and 18 digits'),
      ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'IFSC code must be valid (e.g. HDFC0001234)'),
    }),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().min(5, 'Phone number must be at least 5 characters').optional(),
  }),
});

export const toggleWishlistSchema = z.object({
  body: z.object({
    venueId: z.string().min(1, 'venueId is required').optional(),
  }),
});
