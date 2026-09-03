import { z } from 'zod';

export const analyticsParamsSchema = z.object({
  venueId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid venue ID'),
});

export const blockDatesSchema = z.object({
  dates: z
    .array(
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
        .refine((dateStr) => {
          const d = new Date(`${dateStr}T00:00:00Z`);
          const today = new Date();
          // Use UTC to match the Date object
          const todayUtc = new Date(
            Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
          );
          const sixMonths = new Date(todayUtc);
          sixMonths.setUTCMonth(sixMonths.getUTCMonth() + 6);
          return d >= todayUtc && d <= sixMonths;
        }, 'Dates must be from today up to 6 months in the future')
    )
    .min(1, 'At least one date is required'),
});

export const unblockDatesSchema = z.object({
  dates: z
    .array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'))
    .min(1, 'At least one date is required'),
});

export const offlineBookingSchema = z
  .object({
    venueId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid venue ID'),
    customerName: z.string().trim().min(2, 'Customer name is required'),
    phone: z.string().trim().min(10, 'Valid phone number required'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    startTime: z.number().int().min(0).max(1439, 'startTime must be minutes from midnight'),
    endTime: z.number().int().min(1).max(1440, 'endTime must be minutes from midnight'),
    amountPaid: z.number().positive('Amount must be positive'),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'endTime must be after startTime',
    path: ['endTime'],
  });

export const reviewParamsSchema = z.object({
  venueId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid venue ID'),
  reviewId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid review ID'),
});

export const ownerReplySchema = z.object({
  text: z.string().trim().min(1, 'Reply cannot be empty').max(500, 'Reply too long'),
});

export const reportReviewSchema = z.object({
  action: z.enum(['hide', 'flag']),
  reason: z.string().trim().min(10, 'Reason must be at least 10 characters').max(500),
});

export const inactivityRequestSchema = z.object({
  reason: z.string().trim().min(10).max(500).optional(),
});

export const deleteRequestSchema = z.object({
  reason: z.string().trim().min(10).max(500),
});
