import { z } from "zod";

export const registerVenueSchema = z.object({
  name: z.string().min(3),
  ownerName: z.string().min(2),
  ownerEmail: z.string().email(),
  ownerPhone: z.string(),
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
  images: z.array(z.string()),
  city: z.string().min(2),
  address: z.string().min(5),
  capacity: z.number().int().positive(),
  pricePerHour: z.number().positive(),
  amenities: z.array(z.string()).optional(),
  currency: z.enum(["USD", "EUR", "GBP", "INR", "JPY", "CNY"]),
  description: z.string().optional(),
});
