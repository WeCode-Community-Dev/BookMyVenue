import { z } from 'zod';

export const getPublicVenuesQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => Math.max(1, parseInt(val, 10) || 1)),

  limit: z
    .string()
    .optional()
    .default('12')
    .transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 12))),

  search: z.string().optional(),

  category: z.string().optional(),

  minCapacity: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(0, parseInt(val, 10) || 0) : undefined)),

  maxCapacity: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(0, parseInt(val, 10) || 0) : undefined)),

  minPrice: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(0, parseInt(val, 10) || 0) : undefined)),

  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(0, parseInt(val, 10) || 0) : undefined)),

  sort: z
    .enum(['newest', 'oldest', 'price_asc', 'price_desc', 'capacity_asc', 'capacity_desc'])
    .optional()
    .default('newest'),
});

export type GetPublicVenuesQueryDTO = z.infer<typeof getPublicVenuesQuerySchema>;
