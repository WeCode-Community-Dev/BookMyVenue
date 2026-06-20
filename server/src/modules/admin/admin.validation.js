import { z } from "zod";

export const updateVenueStatusSchema =
  z.object({
    status: z.enum([
      "APPROVED",
      "REJECTED",
    ]),
  });