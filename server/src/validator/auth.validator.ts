import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  email: z.email("a valid email is required"),
  password: z.string().min(6, "password must be at least 6 characters long"),
  // Public signup may only create a CUSTOMER or an OWNER (never an ADMIN).
  role: z
    .enum(["CUSTOMER", "OWNER"], { message: "role must be either CUSTOMER or OWNER" })
    .optional(),
});

export const loginSchema = z.object({
  email: z.email("a valid email is required"),
  password: z.string().min(1, "password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
