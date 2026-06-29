import { z } from 'zod'

export const UpdateVendorProfileSchema = z.object({

    fullName: z.string().trim().min(3).optional(),

    phone: z.string()
        .regex(/^[6-9]\d{9}$/)
        .optional(),

    companyName: z.string().trim().min(2).optional(),

    profileImage: z.object({
        publicId: z.string(),
        url: z.string().url()
    }).optional(),

    address: z.object({
        addressLine1: z.string(),
        city: z.string(),
        state: z.string(),
        pincode: z.string()
    }).optional(),

    bio: z.string().min(10).max(300).optional()

})

export const GetVendorProfileSchema = z.object({})