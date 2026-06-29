import { z } from 'zod';

export const pricingSchema = z.object({
  dayType: z.enum(['weekday', 'weekend', 'holiday']),
  price: z.coerce.number().positive('Price must be positive'),
  minHours: z.coerce.number().int().positive().default(1),
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
});

export const imageSchema = z.object({
  url: z.string().url('Each image must be a valid URL'),
  isPrimary: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
});

export const venueSchema = z.object({
  name: z.string().min(3, 'Venue name must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  type: z.enum([
    'cafe',
    'auditorium',
    'studio',
    'outdoor',
    'banquet',
    'coworking',
    'art_space',
    'rooftop',
    'other',
  ]),
  address: z.string().min(5, 'Address must be at least 5 characters long'),
  city: z.string().min(2, 'City must be at least 2 characters long'),
  state: z.string().min(2, 'State must be at least 2 characters long'),
  capacity: z.coerce.number().int().positive('Capacity must be a positive integer'),
  pincode: z.string().min(4).max(10).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  images: z.array(imageSchema).optional().default([]),
  openDays: z.array(z.string()).optional().default([]),
  openTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format, use HH:MM').optional(),
  closeTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format, use HH:MM').optional(),
  minBookingHours: z.coerce.number().int().positive().default(1),
  bookingType: z.enum(['hourly', 'daily']).default('daily'),
  venueAmenities: z.array(z.string().uuid('Each amenity must be a valid UUID')).optional().default([]),
  pricing: z.array(pricingSchema).optional().default([]),
});
