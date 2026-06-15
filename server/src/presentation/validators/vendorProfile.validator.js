import { z } from 'zod'

export const UpdateVendorProfileSchema = z.object({

    fullName: z
        .string()
        .trim()
        .min(3, 'Name must contain atleast 3 characters'),

    phone: z
        .string()
        .regex(
            /^[6-9]\d{9}$/,
            'Invalid phone number'
        )

})

export const GetVendorProfileSchema = z.object({})