import { z } from 'zod';

export const promoteUserSchema = z.object({
  email: z.email('Invalid email format'),
});

export const demoteUserSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
});

export const getAdminsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});
