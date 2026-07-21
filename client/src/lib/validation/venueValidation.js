import { z } from "zod";

// Keep these values exactly the same as your backend VenueCategory enum
export const VenueCategory = {
  BANQUET_HALL: "BANQUET_HALL",
  CONFERENCE_HALL: "CONFERENCE_HALL",
  AUDITORIUM: "AUDITORIUM",
  OUTDOOR: "OUTDOOR",
  RESTAURANT: "RESTAURANT",
  HOTEL: "HOTEL",
};

// ==============================
// CREATE VENUE SCHEMA
// ==============================

export const createVenueSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Venue name must be at least 3 characters")
    .max(100, "Venue name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters"),

  category: z
    .string()
    .min(1, "Category is required"),

  websiteUrl: z
    .string()
    .url("Invalid website URL")
    .optional()
    .or(z.literal("")),

  addressLine1: z
    .string()
    .trim()
    .min(5, "Address is required"),

  city: z
    .string()
    .trim()
    .min(2, "City is required"),

  state: z
    .string()
    .trim()
    .min(2, "State is required"),

  country: z
    .string()
    .trim()
    .min(2, "Country is required"),

  phone: z
    .string()
    .trim()
    .regex(
      /^[0-9]{10,15}$/,
      "Invalid phone number"
    ),

  pincode: z
    .string()
    .trim()
    .regex(
      /^[0-9]{4,10}$/,
      "Invalid pincode"
    ),

  googleMapLink: z
    .string()
    .url("Invalid Google Map URL")
    .optional()
    .or(z.literal("")),

  seatingCapacity: z.coerce
    .number()
    .min(
      0,
      "Seating capacity cannot be negative"
    ),

  standingCapacity: z.coerce
    .number()
    .min(
      0,
      "Standing capacity cannot be negative"
    ),
  pricePerHour: z.coerce
    .number()
    .min(
      0,
      "Price per hour cannot be negative"
    ),

  pricePerDay: z.coerce
    .number()
    .min(
      0,
      "Price per day cannot be negative"
    ),

  securityDeposit: z.coerce
    .number()
    .min(
      0,
      "Security deposit cannot be negative"
    ),

  weekendSurcharge: z.coerce
    .number()
    .min(
      0,
      "Weekend surcharge cannot be negative"
    ),

  minimumBookingHours: z.coerce
    .number()
    .min(
      0,
      "Minimum booking hours cannot be negative"
    ),

amenities: z
  .preprocess(
    (value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }

      return value;
    },
    z.array(z.string()).optional()
  ),

  images: z
    .array(z.instanceof(File))
    .min(
      3,
      "Upload at least 3 images"
    ),

  license: z
    .instanceof(File)
    .refine(
      (file) =>
        file.type === "application/pdf",
      "Only PDF files are allowed"
    )
    .nullable()
    .optional(),
});

// ==============================
// EDIT VENUE SCHEMA
// ==============================

export const editVenueSchema = createVenueSchema
  .omit({
    images: true,
    license: true,
  })
  .extend({
    vendorId: z.string().min(1, "Vendor ID is required"),

    deletedImages: z.string().optional(),

    deletedLicense: z.string().optional(),
  });