export const QUERY_KEYS = {
  PROFILE: ["profile"] as const,
  ADMIN_VENUES: ["admin", "venues"] as const,
  ADMIN_BOOKINGS: ["admin", "bookings"] as const,
  ADMIN_OWNERS: ["admin", "owners"] as const,
  SUPER_ADMINS: ["superadmin", "admins"] as const,
  MY_VENUES: ["owner", "my-venues"] as const,
  OWNER_ANALYTICS: (venueId: string) =>
    ["owner", "analytics", venueId] as const,
  OWNER_BOOKINGS: (venueId: string) => ["owner", "bookings", venueId] as const,
  OWNER_REVIEWS: (venueId: string) => ["owner", "reviews", venueId] as const,
  OWNER_AVAILABILITY: (venueId: string) =>
    ["owner", "availability", venueId] as const,
  MODERATION_SUMMARY: ["moderation-summary"] as const,
  MODERATION_LOGS: ["moderation-logs"] as const,
  ADMIN_REVIEWS: ["admin", "reviews"] as const,
  OWNER_VENUE_SETTINGS: ["owner", "venue-settings"] as const,
} as const;
