import { z } from 'zod'
import { BookingStatus } from '../../domain/enums/Booking.enum.js'

export const BookingParamsSchema = z.object({

    bookingId: z
        .string()
        .min(1, 'Booking id is required')

})

export const BookingQuerySchema = z.object({

    status: z
        .string()
        .optional(),

    page: z.coerce
        .number()
        .min(1)
        .default(1),

    limit: z.coerce
        .number()
        .min(1)
        .max(50)
        .default(10),
        
    status: z
        .enum(Object.values(BookingStatus))
        .optional(),
    
    search: z
        .string()
        .trim()
        .optional()

})
