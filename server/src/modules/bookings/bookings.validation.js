import { z } from "zod";

export const createBookingSchema = z
  .object({
    venueId: z
      .string()
      .uuid("Invalid venue id"),

    startDate: z
      .string()
      .min(1, "Start date is required"),

    endDate: z
      .string()
      .min(1, "End date is required"),

    guestCount: z.coerce
      .number()
      .int()
      .positive(
        "Guest count must be greater than 0"
      ),

    eventType: z
      .string()
      .trim()
      .optional(),

    notes: z
      .string()
      .trim()
      .optional(),
  })
  .refine(
    (data) =>
      new Date(data.endDate) >=
      new Date(data.startDate),
    {
      message:
        "End date must be after start date",
      path: ["endDate"],
    }
  );

export const updateBookingStatusSchema =
  z.object({
    status: z.enum([
      "CONFIRMED",
      "REJECTED",
      "CANCELLED",
      "COMPLETED",
    ]),
  });