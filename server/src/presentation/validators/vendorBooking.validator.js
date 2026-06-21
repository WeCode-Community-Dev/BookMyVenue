import { z } from 'zod'

export const BookingParamsSchema = z.object({

    bookingId: z
        .string()
        .min(1, 'Booking id is required')

})


export const BookingQuerySchema = z.object({

    status: z
        .string()
        .optional(),

    page: z
        .string()
        .optional(),

    limit: z
        .string()
        .optional()

})