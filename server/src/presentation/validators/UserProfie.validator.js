import{z} from "zod"

export const updateProfileSchema=z.object({
    fullName:z.string()
    .trim()
    .min(3,"Full nam emust be 3 charecters")
    .max(50,"Full name cannot exceed 50 charecters")
    .optional(),

    phone:z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/,"phone number must be 10 digits")
    .optional()
})
.refine(
    data=>data.fullName !==undefined || data.phone !==undefined,
    {
        message:"At least one field must be provided"
    }
)

export const UserProfileParamsSchema=z.object({
    userId:z.string().regex(
        /^[0-9a-fA-F]{24}$/,
        "invalid user ID"
    )
})

export const RequestEmailChangeOtpSchema=z.object({
    newEmail:z.string()
    .trim()
    .email("invalid email address")
})

export const verifyEmailOtpSchema=z.object({
    otp:z.string()
    .trim()
    .regex(/^\d{6}$/,"OTP must be 6 digits")
})

export const userChangePasswordSchema = z.object({

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