import { z } from 'zod';

export const updateAvailabilitySchema = z
  .object({
    openingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
    closingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
    availableDays: z.array(z.number().min(0).max(6)).min(1, 'Select at least one day'),
    minBookingDuration: z.number().positive('Must be greater than 0'),
    maxBookingDuration: z.number().positive().nullable().optional(),
    pricePerHour: z.number().positive('Price must be greater than 0'),
    bufferTime: z.number().min(0, 'Buffer time cannot be negative').optional(),
  })
  .refine(
    (data) => {
      // Basic time comparison (assumes HH:mm)
      return data.closingTime > data.openingTime;
    },
    {
      message: 'Closing time must be after opening time',
      path: ['closingTime'],
    }
  )
  .refine(
    (data) => {
      if (data.maxBookingDuration !== null && data.maxBookingDuration !== undefined) {
        return data.maxBookingDuration >= data.minBookingDuration;
      }
      return true;
    },
    {
      message: 'Max booking duration must be greater than or equal to min booking duration',
      path: ['maxBookingDuration'],
    }
  );

export type UpdateAvailabilityDTO = z.infer<typeof updateAvailabilitySchema>;
