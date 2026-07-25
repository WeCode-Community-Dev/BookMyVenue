import { z } from 'zod'

export const registerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters"),

    email: z
        .string()
        .trim()
        .email("Valid email is required"),

    phone: z
    .string()
    .trim()
    .regex(/^[\d\s]{7,}$/, "Valid phone number is required"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain uppercase, lowercase, number, and special character"
        )
})

export const verifyOtpSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Valid email is required"),

    otpCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, 'OTP must contain only numbers')
      .min(6, "OTP must be exactly 6 digit") 
})

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Valid email is required"),

    password: z
        .string()
        .min(1, "Password is required")
})

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Valid email is required")
})

export const resetPasswordSchema = z.object({
    // email: z
    //     .string()
    //     .trim()
    //     .email("Valid email is required"),

    token: z
        .string()
        .min(1, "Reset token is required"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain uppercase, lowercase, number, and special character"
        )
})

export const resendOtpSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Valid email is required")
})
