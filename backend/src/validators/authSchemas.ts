import { z } from "zod";

const emailSchema = z
  .string()
  .email("Invalid email address")
  .transform((value) => value.toLowerCase().trim());

const userRoleSchema = z.enum(["CUSTOMER", "VENUE_OWNER"]);

export const registerSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must contain a letter")
    .regex(/[0-9]/, "Password must contain a number"),
  phone: z.string().min(1).optional(),
  role: userRoleSchema.optional().default("CUSTOMER"),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
