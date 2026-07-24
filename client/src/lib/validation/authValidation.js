import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name cannot exceed 50 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  role: z
    .enum(["user", "vendor"])
    .default("user"),
});

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
  email: z
    .string()
    .trim()
    .email("Invalid email address"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .min(1, "Email is required"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
