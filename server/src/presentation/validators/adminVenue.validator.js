import { z } from "zod";

export const getAllVenuesQuerySchema = z.object({

    page: z.coerce.number().default(1),

    limit: z.coerce.number().default(10),

    search: z.string().optional(),

    category: z.string().optional(),

    approvalStatus: z
        .enum([
            "PENDING",
            "APPROVED",
            "REJECTED"
        ])
        .optional(),

    isBlocked: z
        .enum([
            "true",
            "false"
        ])
        .optional()

});
export const updateVenueBlockStatusSchema =
    z.object({

        isBlocked:
            z.boolean()

    });

export const rejectVenueSchema = z.object({

    reason: z
        .string()
        .trim()
        .min(1)

});

export const venueIdParamSchema = z.object({

    venueId: z.string()

});