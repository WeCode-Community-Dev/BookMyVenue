import { z } from "zod";
import { VenueTypeEnum } from "../enums/venue-enum";

const MINUTES_IN_DAY = 1440;

const timeOfDay = z
  .number({ message: "must be minutes from midnight (0-1440)" })
  .int("must be a whole number of minutes")
  .min(0, "cannot be before 00:00")
  .max(MINUTES_IN_DAY, "cannot be after 24:00");

export const createVenueSchema = z
  .object({
    name: z.string().trim().min(1, "name is required"),
    description: z.string().trim().optional(),
    venueType: z.enum(VenueTypeEnum, { message: "venueType is invalid" }),
    address: z.string().trim().optional(),
    city: z.string().trim().optional(),
    capacity: z.number().int().positive("capacity must be a positive number").optional(),
    pricePerHour: z.number().nonnegative("pricePerHour must be zero or greater"),
    openingTime: timeOfDay,
    closingTime: timeOfDay,
    images: z.array(z.url("each image must be a valid URL")).optional(),
    amenities: z.array(z.string().trim().min(1)).optional(),
  })
  .refine((data) => data.openingTime < data.closingTime, {
    message: "openingTime must be before closingTime",
    path: ["closingTime"],
  });

export type CreateVenueInput = z.infer<typeof createVenueSchema>;
