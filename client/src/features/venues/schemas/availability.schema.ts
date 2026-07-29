import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const availabilitySchema = z
  .object({
    openingTime: z.string().regex(timeRegex, 'Required (HH:mm)'),
    closingTime: z.string().regex(timeRegex, 'Required (HH:mm)'),
    availableDays: z.array(z.number()).min(1, 'Select at least one day'),
    minBookingDuration: z.number().min(1, 'Minimum 1 hour'),
    maxBookingDuration: z.number().nullable().optional(),
    pricePerHour: z.number().min(1, 'Minimum ₹1'),
    bufferTime: z.number().min(0).optional(),
  })
  .refine((data) => data.closingTime > data.openingTime, {
    message: 'Closing time must be after opening time',
    path: ['closingTime'],
  })
  .refine(
    (data) => {
      if (data.maxBookingDuration !== null && data.maxBookingDuration !== undefined) {
        return data.maxBookingDuration >= data.minBookingDuration;
      }
      return true;
    },
    {
      message: 'Max duration must be >= min duration',
      path: ['maxBookingDuration'],
    }
  );

export type AvailabilityFormValues = z.infer<typeof availabilitySchema>;
