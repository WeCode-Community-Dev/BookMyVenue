


// adminNavConfig.js
export const adminNavItems = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    label: 'Venue Approvals',
    path: '/admin/venues',
    icon: 'BuildingCheck',
    badge: 'pendingCount', // key into live data for the red count badge
  },
  // future: Users, Bookings, Payments — one line each
]