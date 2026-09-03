import { z } from 'zod';

export const createBanSchema = z.object({
  userId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user ID'),
  scope: z.enum(['full', 'commenting', 'owner_dashboard', 'venue_creation']),
  reason: z.string().trim().min(10, 'Reason must be at least 10 characters').max(500),
  venueId: z
    .string()
    .regex(/^[a-f\d]{24}$/i)
    .nullable()
    .optional(),
  expiresAt: z.string().pipe(z.coerce.date()).nullable().optional(),
});

export type CreateBanDTO = z.infer<typeof createBanSchema>;
