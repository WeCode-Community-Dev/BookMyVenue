import { z } from "zod";

export const WishlistParamsSchema = z.object({
    venueId: z.string().regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid venue ID"
    )
});