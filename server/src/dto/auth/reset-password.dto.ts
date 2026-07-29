import z from 'zod';

export const resetPasswordSchema = z
  .object({
    resetToken: z.string().trim(),

    password: z
      .string()
      .min(8)
      .max(128)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/)
      .regex(/^\S*$/),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
