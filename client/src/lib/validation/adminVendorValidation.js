import { z } from "zod";

export const rejectReasonSchema = z.object({
    reason: z
        .string()
        .trim()
        .min(1, "Rejection reason is required")
});