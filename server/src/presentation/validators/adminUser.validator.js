import { z } from "zod";

export const getAllUsersQuerySchema = z.object({
    search: z.string().optional(),

    isBlocked: z
        .enum(["true", "false"])
        .optional(),

    page: z
        .coerce
        .number()
        .min(1)
        .default(1),

    limit: z
        .coerce
        .number()
        .min(1)
        .max(100)
        .default(10)
});

export const updateUserStatusSchema = z.object({

    isBlocked: z.boolean()

});