import { z } from "zod";

export const createVenueSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Venue name is required"),

  type: z.enum([
    "AUDITORIUM",
    "BANQUET_HALL",
    "CAFE",
    "RESTAURANT",
    "CONFERENCE_ROOM",
    "STUDIO",
    "OUTDOOR_SPACE",
    "OTHER",
  ]),

  city: z
    .string()
    .trim()
    .min(2, "City is required"),

  address: z
    .string()
    .trim()
    .optional(),

  description: z
    .string()
    .trim()
    .optional(),

  capacity: z
    .number()
    .int()
    .positive()
    .optional(),

  price: z
    .number()
    .positive()
    .optional(),

  images: z
    .array(
      z.string().url()
    )
    .default([]),
});

export const updateVenueSchema = z.object({
  address: z
    .string()
    .trim()
    .optional(),

  description: z
    .string()
    .trim()
    .optional(),

  capacity: z
    .coerce
    .number()
    .int()
    .positive()
    .optional(),

  price: z
    .coerce
    .number()
    .positive()
    .optional(),
});