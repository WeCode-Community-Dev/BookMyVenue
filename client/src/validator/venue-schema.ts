import { z } from "zod";
import { VENUE_TYPES } from "@/types/venue.types";

// Form keeps numeric/time fields as strings; the page converts them on submit.
export const createVenueFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    venueType: z.enum(VENUE_TYPES, { message: "Select a venue type" }),
    address: z.string().optional(),
    city: z.string().optional(),
    capacity: z.string().optional(),
    pricePerHour: z.string().min(1, "Price per hour is required"),
    openingTime: z.string().min(1, "Opening time is required"),
    closingTime: z.string().min(1, "Closing time is required"),
    amenities: z.string().optional(),
  })
  .refine((data) => !data.capacity || Number(data.capacity) > 0, {
    message: "Capacity must be a positive number",
    path: ["capacity"],
  })
  .refine((data) => !Number.isNaN(Number(data.pricePerHour)) && Number(data.pricePerHour) >= 0, {
    message: "Enter a valid price",
    path: ["pricePerHour"],
  })
  .refine((data) => data.openingTime < data.closingTime, {
    message: "Opening time must be before closing time",
    path: ["closingTime"],
  });

export type CreateVenueFormValues = z.infer<typeof createVenueFormSchema>;
