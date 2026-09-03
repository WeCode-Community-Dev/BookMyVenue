import type { IVenue } from '../modules/venue/venue.types';

export const VenueStatusEnum = [
  'Draft',
  'PendingReview',
  'Approved',
  'Rejected',
  'Suspended',
  'Inactive',
] as const;

export const ReviewIntent = {
  CREATION: 'creation',
  RESUBMISSION: 'resubmission',
  VENUE_EDIT: 'venue_edit',
  INACTIVITY_REQUEST: 'inactivity_request',
  DELETION_REQUEST: 'deletion_request',
} as const;

export type ReviewIntentType = (typeof ReviewIntent)[keyof typeof ReviewIntent];

export const INACTIVITY_COOLDOWN_DAYS = 15;
export const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;

export const KERALA_DISTRICTS = [
  'Thiruvananthapuram',
  'Kollam',
  'Pathanamthitta',
  'Alappuzha',
  'Kottayam',
  'Idukki',
  'Ernakulam',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod',
] as const;

export const VenueFields = [
  'name',
  'description',
  'venueType',
  'address',
  'city',
  'district',
  'pincode',
  'googleMapsUrl',
  'spaceAttributes',
  'seatingConfigurations',
  'maxCapacity',
  'bookingType',
  'fixedPackages',
  'workingDays',
  'workingHours',
  'flexibleBooking',
  'pricing',
  'blockedTimes',
  'blockedDates',
  'amenities',
  'coverImage',
  'galleryImages',
  'contact',
  'cancellation',
] as const;

// Required Fields for Submission

export const SUBMISSION_REQUIRED_FIELDS: (keyof IVenue)[] = [
  'name',
  'description',
  'venueType',
  'address',
  'city',
  'district',
  'pincode',
  'bookingType',
  'cancellation',
  'contact',
  'coverImage',
];

export const VENUE_CONSTANTS = {
  MAX_SUBMISSION_ATTEMPTS: 10,
  EDIT_WINDOW_DAYS: 30,
  MAX_EXTENDED_DAYS: 120,
  AUTO_SUSPEND_REASON: 'Auto-suspended: Owner did not resubmit within 30 days after rejection',
} as const;
