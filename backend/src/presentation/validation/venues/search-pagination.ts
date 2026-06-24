import { z } from 'zod';

export const searchPaginationSchema = z.object({
    limit: z.coerce
        .number()
        .int()
        .positive()
        .max(100)
        .default(10),

    offset: z.coerce
        .number()
        .int()
        .min(0)
        .default(0),

    search: z.string()
        .trim()
        .optional(),

    city: z.string()
        .trim()
        .optional(),

    venueType: z.string()
        .trim()
        .optional(),

    capacity: z.coerce
        .number()
        .int()
        .positive()
        .optional(),
});

export type SearchPaginationDto = z.infer<
    typeof searchPaginationSchema
>;