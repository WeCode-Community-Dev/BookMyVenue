/**
 * All possible roles a user can have in BookMyVenue.
 *
 * - customer    → books venues
 * - venue_owner → lists and manages venues
 * - admin       → platform administrator (created manually, no self-registration)
 */
export enum UserRole {
  CUSTOMER = 'customer',
  VENUE_OWNER = 'venue_owner',
  ADMIN = 'admin',
}
