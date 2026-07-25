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

export const ChangeVendorPasswordSchema = z.object({

    currentPassword: z
        .string()
        .min(6, "Current password is required"),

    newPassword: z
        .string()
        .min(6, "Password must contain at least 6 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain uppercase, lowercase, number, and special character"
        ),

    confirmPassword: z
        .string()

}).refine(

    data => data.newPassword === data.confirmPassword,

    {

        message: "Passwords do not match",

        path: ["confirmPassword"]

    }

);

export const GetVendorProfileSchema = z.object({})