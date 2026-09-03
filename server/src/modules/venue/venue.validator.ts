import { z } from 'zod';
import { KERALA_DISTRICTS } from '../../constants/venue.constants';
import { VENUE_CONSTANTS } from '../../constants/venue.constants';

// Shared sub-schemas

/** [longitude, latitude] */
const coordinatesSchema = z
  .tuple([
    z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
    z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
  ])
  .describe('[longitude, latitude]');

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[\d\s\-().]{7,20}$/, 'Contact phone must be a valid phone number (7-20 characters)');

const urlSchema = z.string().regex(/^https?:\/\/.+/, 'Must be a valid URL');

const GOOGLE_MAPS_ALLOWED_HOSTS = new Set([
  'maps.google.com',
  'www.google.com',
  'google.com',
  'goo.gl',
  'maps.app.goo.gl',
]);

const googleMapsUrlSchema = z
  .url('Must be a valid URL')
  .refine((url) => {
    try {
      const { protocol, hostname } = new URL(url);
      return protocol === 'https:' && GOOGLE_MAPS_ALLOWED_HOSTS.has(hostname);
    } catch {
      return false;
    }
  }, 'Must be a valid Google Maps URL (google.com or maps.google.com)')
  .optional();

const venueIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, 'Invalid venue ID');

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

const fixedPackageSchema = z.object({
  slotName: z.string().trim().min(1, 'Slot name is required'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
});

const pricingRuleSchema = z.object({
  fromTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  toTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
});

const blockedTimeSchema = z.object({
  fromTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  toTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
});

export const refundRuleSchema = z.object({
  daysBefore: z.number().int().min(0, 'Days before must be positive'),
  refundPercentage: z.number().min(0).max(100, 'Percentage must be between 0 and 100'),
});

// Venue Creation Validation
export const createVenueSchema = z
  .object({
    // Basic Info
    name: z.string().trim().min(3, 'Name must be at least 3 characters').max(100),
    description: z.string().trim().min(10, 'Description must be at least 10 characters'),
    venueType: z.string().trim().min(1, 'Venue type is required'),

    // Location
    address: z.string().trim().min(5, 'Address must be at least 5 characters'),
    city: z.string().trim().min(2).max(100),
    district: z.enum(KERALA_DISTRICTS),
    pincode: z.string().trim().min(4).max(20),
    coordinates: coordinatesSchema.optional(),
    googleMapsUrl: googleMapsUrlSchema,

    // Space & Capacity
    spaceAttributes: z.array(z.string()).default([]),
    seatingConfigurations: z.array(z.string()).default([]),
    maxCapacity: z.coerce.number().int().positive().optional(),

    // Booking & Pricing Config
    bookingType: z.enum(['fixedBooking', 'flexibleBooking']),

    // Fixed booking fields
    fixedPackages: z.array(fixedPackageSchema).optional(),

    // Both booking types
    workingDays: z.array(z.enum(DAYS_OF_WEEK)).min(1, 'At least one working day is required'),

    // Flexible booking fields
    workingHours: z
      .object({
        open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
        close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
      })
      .optional(),
    flexibleBooking: z
      .object({
        slotDuration: z.coerce.number().int().positive().default(60),
        bufferTime: z.coerce.number().int().min(0).default(0),
      })
      .optional(),
    pricing: z
      .object({
        pricingType: z.enum(['fixedPricing', 'timeBasedPricing']),
        basePrice: z.coerce.number().min(0, 'Base price must be 0 or higher'),
        pricingRules: z.array(pricingRuleSchema).default([]),
      })
      .optional(),
    blockedTimes: z.array(blockedTimeSchema).default([]),
    blockedDates: z.array(z.coerce.date()).default([]),

    // Amenities
    amenities: z.array(z.string()).min(1, 'At least one amenity is required'),

    // Media
    coverImage: urlSchema,
    galleryImages: z.array(urlSchema).max(20).optional(),

    // Contact
    contact: z.object({
      name: z.string().trim().min(2).max(100),
      phone: phoneSchema,
      email: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Must be a valid email')
        .optional(),
    }),

    // Cancellation & Refund
    cancellation: z.object({
      policy: z.enum(['refundable', 'nonRefundable']),
      refundType: z.enum(['fullRefund', 'timeBasedRefund']).optional(),
      refundRules: z.array(refundRuleSchema).default([]),
    }),
  })
  .superRefine((data, ctx) => {
    // Helper: HH:MM → minutes since midnight
    const toMin = (t: string): number => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    // Fixed booking: must have at least one package
    if (data.bookingType === 'fixedBooking') {
      if (!data.fixedPackages || data.fixedPackages.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'At least one fixed package is required for fixed booking',
          path: ['fixedPackages'],
        });
      }
    }

    // Flexible booking: requires workingHours, flexibleBooking, and pricing
    if (data.bookingType === 'flexibleBooking') {
      if (!data.pricing) {
        ctx.addIssue({
          code: 'custom',
          message: 'Pricing is required for flexible booking',
          path: ['pricing'],
        });
        return;
      }
      if (!data.workingHours) {
        ctx.addIssue({
          code: 'custom',
          message: 'Working hours are required for flexible booking',
          path: ['workingHours'],
        });
      } else {
        if (!data.workingHours.open) {
          ctx.addIssue({
            code: 'custom',
            message: 'Open time is required for flexible booking',
            path: ['workingHours', 'open'],
          });
        }
        if (!data.workingHours.close) {
          ctx.addIssue({
            code: 'custom',
            message: 'Close time is required for flexible booking',
            path: ['workingHours', 'close'],
          });
        }
        // close must be after open
        if (data.workingHours.open && data.workingHours.close) {
          if (toMin(data.workingHours.close) <= toMin(data.workingHours.open)) {
            ctx.addIssue({
              code: 'custom',
              message: 'Close time must be after open time',
              path: ['workingHours', 'close'],
            });
          }
        }
      }

      if (!data.flexibleBooking?.slotDuration) {
        ctx.addIssue({
          code: 'custom',
          message: 'Slot duration is required for flexible booking',
          path: ['flexibleBooking', 'slotDuration'],
        });
      }

      // Time-based pricing: must have at least one pricing rule
      if (
        data.pricing.pricingType === 'timeBasedPricing' &&
        data.pricing.pricingRules.length === 0
      ) {
        ctx.addIssue({
          code: 'custom',
          message: 'At least one pricing rule is required for time-based pricing',
          path: ['pricing', 'pricingRules'],
        });
      }

      // Working-hours boundary checks for pricing rules
      const wh = data.workingHours;
      const openMin = wh?.open ? toMin(wh.open) : null;
      const closeMin = wh?.close ? toMin(wh.close) : null;

      if (openMin !== null && closeMin !== null && wh) {
        data.pricing.pricingRules.forEach((rule, i) => {
          if (rule.fromTime) {
            const from = toMin(rule.fromTime);
            if (from < openMin) {
              ctx.addIssue({
                code: 'custom',
                message: `From time must be on or after open time (${wh.open})`,
                path: ['pricing', 'pricingRules', i, 'fromTime'],
              });
            }
          }
          if (rule.toTime) {
            const to = toMin(rule.toTime);
            if (to > closeMin) {
              ctx.addIssue({
                code: 'custom',
                message: `To time must be on or before close time (${wh.close})`,
                path: ['pricing', 'pricingRules', i, 'toTime'],
              });
            }
          }
          if (rule.fromTime && rule.toTime && toMin(rule.toTime) <= toMin(rule.fromTime)) {
            ctx.addIssue({
              code: 'custom',
              message: 'To time must be after from time',
              path: ['pricing', 'pricingRules', i, 'toTime'],
            });
          }
        });

        // Validate blockedTimes stay within working hours
        data.blockedTimes.forEach((block, i) => {
          if (block.fromTime) {
            const from = toMin(block.fromTime);
            if (from < openMin) {
              ctx.addIssue({
                code: 'custom',
                message: `From time must be on or after open time (${wh.open})`,
                path: ['blockedTimes', i, 'fromTime'],
              });
            }
          }
          if (block.toTime) {
            const to = toMin(block.toTime);
            if (to > closeMin) {
              ctx.addIssue({
                code: 'custom',
                message: `To time must be on or before close time (${wh.close})`,
                path: ['blockedTimes', i, 'toTime'],
              });
            }
          }
          if (block.fromTime && block.toTime && toMin(block.toTime) <= toMin(block.fromTime)) {
            ctx.addIssue({
              code: 'custom',
              message: 'To time must be after from time',
              path: ['blockedTimes', i, 'toTime'],
            });
          }
        });
      }
    }

    // Time-based refund: must have at least one refund rule
    if (
      data.cancellation.policy === 'refundable' &&
      data.cancellation.refundType === 'timeBasedRefund' &&
      data.cancellation.refundRules.length === 0
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'At least one refund rule is required for time-based refund policy',
        path: ['cancellation', 'refundRules'],
      });
    }
  });

export type CreateVenueDTO = z.infer<typeof createVenueSchema>;

// Update
// PUT /venues/:id
export const updateVenueSchema = z
  .object({
    expectedVersion: z.number().int().optional(),
    name: z.string().trim().min(3, 'Name must be at least 3 characters').max(100),
    description: z.string().trim().min(10, 'Description must be at least 10 characters'),
    venueType: z.string().trim().min(1, 'Venue type is required'),
    address: z.string().trim().min(5, 'Address must be at least 5 characters'),
    city: z.string().trim().min(2).max(100),
    district: z.string().trim().min(2).max(100),
    pincode: z.string().trim().min(4).max(20),
    coordinates: coordinatesSchema.optional(),
    googleMapsUrl: googleMapsUrlSchema,
    spaceAttributes: z.array(z.string()),
    seatingConfigurations: z.array(z.string()),
    maxCapacity: z.coerce.number().int().positive().optional(),
    bookingType: z.enum(['fixedBooking', 'flexibleBooking']),
    fixedPackages: z.array(fixedPackageSchema),
    workingDays: z.array(z.enum(DAYS_OF_WEEK)).min(1, 'At least one working day is required'),
    workingHours: z.object({
      open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    }),
    flexibleBooking: z.object({
      slotDuration: z.coerce.number().int().positive(),
      bufferTime: z.coerce.number().int().min(0),
    }),
    pricing: z
      .object({
        pricingType: z.enum(['fixedPricing', 'timeBasedPricing']),
        basePrice: z.coerce.number().min(0),
        pricingRules: z.array(pricingRuleSchema).default([]),
      })
      .optional(),
    blockedTimes: z.array(blockedTimeSchema),
    blockedDates: z.array(z.coerce.date()),
    amenities: z.array(z.string()),
    coverImage: urlSchema,
    galleryImages: z.array(urlSchema).max(20).optional(),
    contact: z.object({
      name: z.string().trim().min(2).max(100),
      phone: phoneSchema,
      email: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Must be a valid email')
        .optional(),
    }),
    cancellation: z.object({
      policy: z.enum(['refundable', 'nonRefundable']),
      refundType: z.enum(['fullRefund', 'timeBasedRefund']).optional(),
      refundRules: z.array(refundRuleSchema).default([]),
    }),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateVenueDTO = z.infer<typeof updateVenueSchema>;

// Reject venue with optional extended deadline
export const rejectVenueSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .max(500, 'Rejection reason must be under 500 characters')
    .optional(),
  extendedDeadline: z.coerce
    .date()
    .optional()
    .refine(
      (date) =>
        !date ||
        (date > new Date(Date.now() + VENUE_CONSTANTS.EDIT_WINDOW_DAYS * 24 * 60 * 60 * 1000) &&
          date <= new Date(Date.now() + VENUE_CONSTANTS.MAX_EXTENDED_DAYS * 24 * 60 * 60 * 1000)),
      `Extended deadline must be between ${String(VENUE_CONSTANTS.EDIT_WINDOW_DAYS)} and ${String(VENUE_CONSTANTS.MAX_EXTENDED_DAYS)} days`
    ),
});

export type RejectVenueDTO = z.infer<typeof rejectVenueSchema>;

// Extend venue deadline
export const extendVenueDeadlineSchema = z.object({
  newDeadline: z.coerce
    .date()
    .refine(
      (date) =>
        date > new Date() &&
        date <= new Date(Date.now() + VENUE_CONSTANTS.MAX_EXTENDED_DAYS * 24 * 60 * 60 * 1000),
      `New deadline must be in the future and within ${String(VENUE_CONSTANTS.MAX_EXTENDED_DAYS)} days`
    ),
});

export type ExtendVenueDeadlineDTO = z.infer<typeof extendVenueDeadlineSchema>;

export const suspendVenueSchema = z.object({
  suspensionReason: z
    .string()
    .trim()
    .min(10, 'Suspension reason must be at least 10 characters')
    .max(500, 'Suspension reason must be under 500 characters'),
});

export type SuspendVenueDTO = z.infer<typeof suspendVenueSchema>;

export const featureVenueSchema = z.object({
  durationDays: z.enum(['7', '30', 'indefinite']),
});

export type FeatureVenueDTO = z.infer<typeof featureVenueSchema>;

// Admin list filters

export const adminVenueFiltersSchema = z.object({
  status: z
    .enum(['Draft', 'PendingReview', 'Approved', 'Rejected', 'Suspended', 'Inactive'])
    .optional(),
  city: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type AdminVenueFiltersDTO = z.infer<typeof adminVenueFiltersSchema>;

const stringOrArray = z.preprocess(
  (val) => (Array.isArray(val) ? val : val ? [val] : undefined),
  z.array(z.string()).optional()
);

export const publicVenueFiltersSchema = z
  .object({
    searchTerm: z.string().trim().max(100).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    venueType: stringOrArray,
    district: z.enum(KERALA_DISTRICTS).optional(),
    capacity: z.coerce.number().int().positive().optional(),
    spaceAttributes: stringOrArray,
    seatingConfigurations: stringOrArray,
    amenities: stringOrArray,
    lat: z.coerce.number().min(-90).max(90).optional(),
    lng: z.coerce.number().min(-180).max(180).optional(),
    radiusKm: z.coerce.number().positive().max(200).default(25).optional(),
    sortBy: z.enum(['price-low', 'price-high', 'rating', 'distance']).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  })
  .refine(
    (data) => {
      // If lat is provided, lng must also be provided
      if (data.lat !== undefined && data.lng === undefined) return false;
      // If lng is provided, lat must also be provided
      if (data.lng !== undefined && data.lat === undefined) return false;
      return true;
    },
    {
      message: 'Both latitude and longitude must be provided together',
      path: ['lat', 'lng'],
    }
  );

export type PublicVenueFiltersDTO = z.infer<typeof publicVenueFiltersSchema>;

// Review schemas

export const approveReviewSchema = z.object({
  note: z.string().trim().max(500).optional(),
});

export type ApproveReviewDTO = z.infer<typeof approveReviewSchema>;

export const rejectReviewSchema = z.object({
  note: z.string().trim().min(1).max(500),
});

export type RejectReviewDTO = z.infer<typeof rejectReviewSchema>;

// Route param

export const venueIdParamSchema = z.object({
  id: venueIdSchema,
});

export type VenueIdParamDTO = z.infer<typeof venueIdParamSchema>;
