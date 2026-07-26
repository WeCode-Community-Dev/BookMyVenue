export const ActionEnum = [
  'create',
  'read',
  'update',
  'delete',
  'approve',
  'reject',
  'activate',
  'deactivate',
] as const;

export const EntityEnum = [
  'users',
  'venues',
  'bookings',
  'roles',
  'permissions',
  'payments',
  'reviews',
  'wishlist',
] as const;

export type IAction = (typeof ActionEnum)[number];
export type IEntity = (typeof EntityEnum)[number];
export type IPermission = `${IAction}:${IEntity}`;

export const PERMISSIONS = {
  users: {
    create: 'create:users' as IPermission,
    read: 'read:users' as IPermission,
    update: 'update:users' as IPermission,
    delete: 'delete:users' as IPermission,
    activate: 'activate:users' as IPermission,
    deactivate: 'deactivate:users' as IPermission,
  },
  venues: {
    create: 'create:venues' as IPermission,
    read: 'read:venues' as IPermission,
    update: 'update:venues' as IPermission,
    delete: 'delete:venues' as IPermission,
    activate: 'activate:venues' as IPermission,
    deactivate: 'deactivate:venues' as IPermission,
  },
  bookings: {
    create: 'create:bookings' as IPermission,
    read: 'read:bookings' as IPermission,
    update: 'update:bookings' as IPermission,
    delete: 'delete:bookings' as IPermission,
    approve: 'approve:bookings' as IPermission,
    reject: 'reject:bookings' as IPermission,
    activate: 'activate:bookings' as IPermission,
    deactivate: 'deactivate:bookings' as IPermission,
  },
  roles: {
    create: 'create:roles' as IPermission,
    read: 'read:roles' as IPermission,
    update: 'update:roles' as IPermission,
    delete: 'delete:roles' as IPermission,
    activate: 'activate:roles' as IPermission,
    deactivate: 'deactivate:roles' as IPermission,
  },
  permissions: {
    create: 'create:permissions' as IPermission,
    read: 'read:permissions' as IPermission,
    update: 'update:permissions' as IPermission,
    delete: 'delete:permissions' as IPermission,
    activate: 'activate:permissions' as IPermission,
    deactivate: 'deactivate:permissions' as IPermission,
  },
  payments: {
    create: 'create:payments' as IPermission,
    read: 'read:payments' as IPermission,
    update: 'update:payments' as IPermission,
    delete: 'delete:payments' as IPermission,
    approve: 'approve:payments' as IPermission,
    reject: 'reject:payments' as IPermission,
    activate: 'activate:payments' as IPermission,
    deactivate: 'deactivate:payments' as IPermission,
  },
  reviews: {
    create: 'create:reviews' as IPermission,
    read: 'read:reviews' as IPermission,
    update: 'update:reviews' as IPermission,
    delete: 'delete:reviews' as IPermission,
  },
  wishlist: {
    create: 'create:wishlist' as IPermission,
    read: 'read:wishlist' as IPermission,
    delete: 'delete:wishlist' as IPermission,
  },
} as const;

// Static reference map — lowest priority number = highest rank.
// Runtime inheritance is resolved dynamically via $graphLookup, not this map.
// Extend this when new roles are added to the DB.
export const ROLE_HIERARCHY: Record<string, string[]> = {
  superAdmin: ['superAdmin', 'admin', 'owner', 'user'],
  admin: ['admin', 'owner', 'user'],
  owner: ['owner', 'user'],
  user: ['user'],
};
