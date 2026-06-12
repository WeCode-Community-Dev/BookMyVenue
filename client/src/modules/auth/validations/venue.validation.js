import { z } from 'zod';

export const registerVenueSchema = z.object({

   name: z
      .string()
      .min(3, 'Venue name must be at least 3 characters long'),

   type: z.enum(
      ['AUDITORIUM', 'BANQUET_HALL', 'CAFE', 'RESTAURANT', 'CONFERENCE_ROOM', 'STUDIO', 'OUTDOOR_SPACE', 'OTHER'],
      { errorMap: () => ({ message: 'Please select a valid venue type' }) }
   ),

   capacity: z
      .number({ invalid_type_error: 'Capacity must be a number' })
      .int('Capacity must be a whole number')
      .positive('Capacity must be a positive number'),

   pricePerHour: z
      .number({ invalid_type_error: 'Price must be a number' })
      .positive('Price per hour must be a positive number'),

   currency: z.enum(
      ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CNY'],
      { errorMap: () => ({ message: 'Please select a valid currency' }) }
   ),

   city: z
      .string()
      .min(2, 'City name must be at least 2 characters long'),

   address: z
      .string()
      .min(5, 'Address must be at least 5 characters long'),

   description: z
      .string()
      .optional(),

   images: z
      .array(z.string().url('Each image must be a valid URL'))
      .min(1, 'Please add at least one image URL'),


   amenities: z
      .array(z.string())
      .optional()
      .default([]),

   
   ownerName: z
      .string()
      .min(2, 'Owner name must be at least 2 characters long'),

   ownerEmail: z
      .string()
      .email('Please enter a valid email address'),

   ownerPhone: z
      .string()
      .regex(
         /^\+?(\d{1,3})?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
         'Please enter a valid phone number'
      ),

});