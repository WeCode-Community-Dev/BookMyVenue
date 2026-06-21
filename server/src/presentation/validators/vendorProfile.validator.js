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
        ),

    companyName: z
        .string()
        .trim()
        .min(2, 'Company name is required'),

    profileImage: z.object({

        publicId: z
            .string()
            .min(1, 'Profile image publicId is required'),

        url: z
            .string()
            .url('Invalid profile image url')

    }),

    address: z.object({

        addressLine1: z
            .string()
            .trim()
            .min(3, 'Address is required'),

        city: z
            .string()
            .trim()
            .min(2, 'City is required'),

        state: z
            .string()
            .trim()
            .min(2, 'State is required'),

        pincode: z
            .string()
            .regex(
                /^\d{6}$/,
                'Invalid pincode'
            )

    }),

    bio: z
        .string()
        .trim()
        .min(10, 'Bio must contain atleast 10 characters')
        .max(300, 'Bio cannot exceed 300 characters')

})

export const GetVendorProfileSchema = z.object({})