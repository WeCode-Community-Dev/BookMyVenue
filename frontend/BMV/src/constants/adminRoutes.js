const ADMIN_ROUTES = [
  { path: "/admin/login", label: "Superadmin login", public: true },
  { path: "/admin", label: "Dashboard" },
  { path: "/admin/pending", label: "Pending venues" },
  { path: "/admin/venues", label: "Manage venues" },
  { path: "/admin/venues/new", label: "Create venue" },
  { path: "/admin/bookings", label: "All bookings" },
  { path: "/admin/users", label: "Manage users" },
  { path: "/admin/users/new", label: "Create user" },
];

export default ADMIN_ROUTES;
