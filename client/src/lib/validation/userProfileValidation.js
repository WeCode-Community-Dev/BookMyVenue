import { z } from "zod";

export const updateProfileSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Full nam emust be 3 charecters")
      .max(50, "Full name cannot exceed 50 charecters")
      .optional(),

    phone: z
      .string()
      .trim()
      .regex(/^[0-9]{10}$/, "phone number must be 10 digits")
      .optional(),
  })
  .refine(
    (data) =>
      data.fullName?.trim() || data.phone?.trim(),
    {
      message: "At least one field must be provided",
    }
  );

export const UserProfileParamsSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid user ID"),
});

export const RequestEmailChangeOtpSchema = z.object({
  newEmail: z.string().trim().email("invalid email address"),
});

export const verifyEmailOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});
