import { RoleEnum, RoleEnumType } from "../enums/user-enum";

export const Permissions = {
  // Venue management
  CREATE_VENUE: "CREATE_VENUE",
  UPDATE_VENUE: "UPDATE_VENUE",
  DELETE_VENUE: "DELETE_VENUE",
  APPROVE_VENUE: "APPROVE_VENUE",

  // Booking
  CREATE_BOOKING: "CREATE_BOOKING",
  CANCEL_BOOKING: "CANCEL_BOOKING",
  VIEW_VENUE_BOOKINGS: "VIEW_VENUE_BOOKINGS",
  VIEW_ALL_BOOKINGS: "VIEW_ALL_BOOKINGS",

  // Review
  CREATE_REVIEW: "CREATE_REVIEW",
  UPDATE_REVIEW: "UPDATE_REVIEW",
  DELETE_REVIEW: "DELETE_REVIEW",

  // User administration
  MANAGE_USERS: "MANAGE_USERS",

  // Platform analytics
  VIEW_REVENUE: "VIEW_REVENUE",
} as const;

export type PermissionType = (typeof Permissions)[keyof typeof Permissions];

export const RolePermissions: Record<RoleEnumType, PermissionType[]> = {
  [RoleEnum.ADMIN]: [
    // admin can do everything
    Permissions.CREATE_VENUE,
    Permissions.UPDATE_VENUE,
    Permissions.DELETE_VENUE,
    Permissions.APPROVE_VENUE,
    Permissions.CREATE_BOOKING,
    Permissions.CANCEL_BOOKING,
    Permissions.VIEW_VENUE_BOOKINGS,
    Permissions.VIEW_ALL_BOOKINGS,
    Permissions.CREATE_REVIEW,
    Permissions.UPDATE_REVIEW,
    Permissions.DELETE_REVIEW,
    Permissions.MANAGE_USERS,
    Permissions.VIEW_REVENUE,
  ],

  [RoleEnum.OWNER]: [
    // owners manage their own venues and see who booked them
    Permissions.CREATE_VENUE,
    Permissions.UPDATE_VENUE,
    Permissions.DELETE_VENUE,
    Permissions.VIEW_VENUE_BOOKINGS,
  ],

  [RoleEnum.CUSTOMER]: [
    // customers book venues and leave reviews
    Permissions.CREATE_BOOKING,
    Permissions.CANCEL_BOOKING,
    Permissions.CREATE_REVIEW,
    Permissions.UPDATE_REVIEW,
    Permissions.DELETE_REVIEW,
  ],
};

// Returns true if the given role is allowed to perform the given action.
export const hasPermission = (role: RoleEnumType, permission: PermissionType): boolean => {
  const permissions = RolePermissions[role];
  if (!permissions) return false;
  return permissions.includes(permission);
};
