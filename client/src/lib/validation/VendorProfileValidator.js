import { z } from "zod";

export const UpdateVendorProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must contain at least 3 characters")
    .optional(),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
    .optional(),

  companyName: z
    .string()
    .trim()
    .min(2, "Company name must contain at least 2 characters")
    .optional(),

  address: z
    .object({
      addressLine1: z
        .string()
        .min(1, "Address is required"),

      city: z
        .string()
        .min(1, "City is required"),

      state: z
        .string()
        .min(1, "State is required"),

      pincode: z
        .string()
        .regex(/^\d{6}$/, "Pincode must be 6 digits"),
    })
    .optional(),

  bio: z
    .string()
    .min(10, "Bio must contain at least 10 characters")
    .max(300, "Bio cannot exceed 300 characters")
    .optional(),
});