import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const createReservationSchema = z
  .object({
    venueId: z.string().refine((value) => isValidObjectId(value), {
      message: "Invalid venue id",
    }),
    startTime: z.coerce.date({ message: "startTime must be a valid date" }),
    endTime: z.coerce.date({ message: "endTime must be a valid date" }),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "startTime must be before endTime",
    path: ["endTime"],
  })
  .refine((data) => data.startTime.getTime() > Date.now(), {
    message: "startTime must be in the future",
    path: ["startTime"],
  });

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
