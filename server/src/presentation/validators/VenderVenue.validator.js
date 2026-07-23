import { z } from "zod";
import { Amenities, VenueCategory, VenueStatus } from '../../domain/enums/Venue.enum.js'


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

    category: z.nativeEnum(VenueCategory),
    // vendorId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid owner ID'),

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
        .regex(/^[0-9]{10,15}$/, "Invalid phone number"),

    pincode: z
        .string()
        .trim()
        .regex(/^[0-9]{4,10}$/, "Invalid pincode"),

    googleMapLink: z
        .string()
        .url("Invalid Google Map URL")
        .optional()
        .or(z.literal("")),

    seatingCapacity: z
        .coerce
        .number()
        .min(0, "Seating capacity cannot be negative"),

    standingCapacity: z
        .coerce
        .number()
        .min(0, "Standing capacity cannot be negative"),

    pricePerHour: z
        .coerce
        .number()
        .min(0, "Price per hour cannot be negative"),

    pricePerDay: z
        .coerce
        .number()
        .min(0, "Price per day cannot be negative"),

    securityDeposit: z
        .coerce
        .number()
        .min(0, "Security deposit cannot be negative"),

    weekendSurcharge: z
        .coerce
        .number()
        .min(0, "Weekend surcharge cannot be negative"),

    minimumBookingHours: z
        .coerce
        .number()
        .min(0, "Minimum booking hours cannot be negative"),

    availabilityRules: z
        .record(z.any())
        .optional(),

amenities: z.preprocess(
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
})

export const VenueParamsSchema = z.object({
    venueId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid venue ID'),
    // ownerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid venue ID')
})

export const editVenueSchema = z.object({
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
    category: z.nativeEnum(VenueCategory),
    vendorId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid owner ID'),
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
        .regex(/^[0-9]{10,15}$/, "Invalid phone number"),

    pincode: z
        .string()
        .trim()
        .regex(/^[0-9]{4,10}$/, "Invalid pincode"),

    googleMapLink: z
        .string()
        .url("Invalid Google Map URL")
        .optional()
        .or(z.literal("")),

    seatingCapacity: z
        .coerce
        .number()
        .min(0, "Seating capacity cannot be negative"),

    standingCapacity: z
        .coerce
        .number()
        .min(0, "Standing capacity cannot be negative"),

    pricePerHour: z
        .coerce
        .number()
        .min(0, "Price per hour cannot be negative"),

    pricePerDay: z
        .coerce
        .number()
        .min(0, "Price per day cannot be negative"),

    securityDeposit: z
        .coerce
        .number()
        .min(0, "Security deposit cannot be negative"),

    weekendSurcharge: z
        .coerce
        .number()
        .min(0, "Weekend surcharge cannot be negative"),

    minimumBookingHours: z
        .coerce
        .number()
        .min(0, "Minimum booking hours cannot be negative"),

    availabilityRules: z
        .record(z.any())
        .optional(),

    amenities: z
        .array(z.string())
        .optional(),
    deletedImages: z
        .string()
        .transform(value => JSON.parse(value))
        .pipe(z.array(z.string()))
        .optional()
})

export const VenueQuerySchema = z.object({
    vendorId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid venue ID')
        .optional(),
    capacityType: z
        .string()
        .optional(),
    capacity: z
        .coerce
        .number()
        .optional(),

    priceType: z
        .string()
        .optional(),

    minPrice: z.coerce
        .number()
        .optional(),

    maxPrice: z.coerce
        .number()
        .optional(),

    category: z
        .nativeEnum(VenueCategory)
        .optional(),

    rating: z.coerce
        .number()
        .min(0)
        .max(5)
        .optional(),

    amenities: z
        .union([
            z.nativeEnum(Amenities),
            z.array(z.nativeEnum(Amenities))
        ])
        .optional(),

    search: z
        .string()
        .optional(),

    status: z
        .nativeEnum(VenueStatus)
        .optional(),

    price: z.coerce
        .number()
        .optional(),

    page: z.coerce
        .number()
        .default(1),

    limit: z.coerce
        .number()
        .default(10)
})

export const VenueUpdateStatusSchema = z.object({
    status: z.nativeEnum(VenueStatus)
})