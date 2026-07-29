import { z } from 'zod';

export const getOwnerVenuesQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => Math.max(1, parseInt(val, 10) || 1)),

  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 10))),

  search: z.string().optional(),

  status: z.enum(['pending', 'approved', 'rejected', 'all']).optional(),

  category: z.string().optional(),

  sort: z.enum(['asc', 'desc']).optional().default('desc'),

  isDeleted: z.enum(['true', 'false']).optional().default('false'),
});

export type GetOwnerVenuesQueryDTO = z.infer<typeof getOwnerVenuesQuerySchema>;
