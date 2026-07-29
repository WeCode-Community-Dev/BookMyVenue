import { z } from 'zod';

export const rejectVenueSchema = z.object({
  rejectionReason: z
    .string()
    .min(10, 'Rejection reason must be at least 10 characters')
    .max(500, 'Rejection reason must not exceed 500 characters'),
});

export type RejectVenueDTO = z.infer<typeof rejectVenueSchema>;
