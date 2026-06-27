import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const createReviewSchema = z.object({
  venueId: z.string().refine((value) => isValidObjectId(value), {
    message: "Invalid venue id",
  }),
  rating: z
    .number({ message: "rating is required" })
    .int("rating must be a whole number")
    .min(1, "rating must be at least 1")
    .max(5, "rating must be at most 5"),
  comment: z.string().trim().min(1, "comment is required"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
