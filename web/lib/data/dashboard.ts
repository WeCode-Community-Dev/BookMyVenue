export type BookingStatus = "confirmed" | "pending" | "draft";

export type StatChangeType = "positive" | "negative" | "neutral";

export type NavIcon =
  | "layout-dashboard"
  | "map-pin"
  | "calendar-days"
  | "calendar"
  | "star"
  | "settings";

export const dashboardUser = {
  name: "Alex Thompson",
  role: "Admin Level",
  initials: "AT",
};

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "layout-dashboard" as NavIcon },
  { label: "My Venues", href: "/my-venues", icon: "map-pin" as NavIcon },
  { label: "Bookings", href: "/bookings", icon: "calendar-days" as NavIcon },
  { label: "Calendar", href: "/calendar", icon: "calendar" as NavIcon },
  { label: "Reviews", href: "/reviews", icon: "star" as NavIcon },
];

export const settingsNavItem = {
  label: "Settings",
  href: "#",
  icon: "settings" as NavIcon,
};

export const statCards = [
  {
    title: "Total Venues",
    value: "4",
    change: "+0 this month",
    changeType: "neutral" as StatChangeType,
    icon: "building-2" as const,
  },
  {
    title: "Total Spaces",
    value: "12",
    change: "+2 this month",
    changeType: "positive" as StatChangeType,
    icon: "door-open" as const,
  },
  {
    title: "Active Bookings",
    value: "28",
    change: "-4% from peak",
    changeType: "negative" as StatChangeType,
    icon: "ticket" as const,
  },
  {
    title: "Monthly Revenue",
    value: "$12,450",
    change: "+12.5% increase",
    changeType: "positive" as StatChangeType,
    icon: "wallet" as const,
  },
];

export const upcomingBookings = [
  {
    customer: "Jane Doe",
    initials: "JD",
    space: "Skyline Hall A",
    date: "Oct 24, 2023",
    status: "confirmed" as BookingStatus,
  },
  {
    customer: "Mark Smith",
    initials: "MS",
    space: "Green Garden",
    date: "Oct 25, 2023",
    status: "pending" as BookingStatus,
  },
  {
    customer: "Tech Logistics Inc.",
    initials: "TL",
    space: "Boardroom Z",
    date: "Oct 26, 2023",
    status: "draft" as BookingStatus,
  },
  {
    customer: "Robert King",
    initials: "RK",
    space: "Skyline Hall B",
    date: "Oct 28, 2023",
    status: "confirmed" as BookingStatus,
  },
];

export const quickActions = [
  { label: "Create Venue", href: "#", icon: "plus-circle" as const },
  { label: "Add Space", href: "#", icon: "layout-grid" as const },
  { label: "Block Availability", href: "#", icon: "ban" as const },
];

export const recentActivity = [
  {
    message: "Payment received for Skyline Hall A booking",
    timeAgo: "2 mins ago",
  },
  {
    message: "New Review from Sarah Parker (5 stars)",
    timeAgo: "45 mins ago",
  },
  {
    message: "Booking update: Boardroom Z moved to Oct 27",
    timeAgo: "2 hours ago",
  },
];

export const mapWidget = {
  district: "New York District",
  label: "Active Operations: New York District",
};

