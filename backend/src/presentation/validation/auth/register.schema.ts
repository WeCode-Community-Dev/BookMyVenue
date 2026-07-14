import z from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.enum(['USER', 'VENUE_OWNER', 'ADMIN']).optional(),
});
