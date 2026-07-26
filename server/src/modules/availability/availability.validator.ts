import { z } from 'zod';
import { isBookableDate } from '../../utils/timeUtils';

export const availabilityQuerySchema = z.object({
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date query parameter must be in YYYY-MM-DD format')
    .optional()
    .refine((val) => !val || isBookableDate(val), {
      message: 'Date must be between tomorrow and 90 days from today',
    }),
});

export type AvailabilityQueryDTO = z.infer<typeof availabilityQuerySchema>;
