export type StatChangeType = "positive" | "negative" | "neutral";

export type NavIcon =
  | "layout-dashboard"
  | "map-pin"
  | "calendar-days"
  | "calendar"
  | "star"
  | "settings";

  export const getDashboardUser = ()=> {
    const firstName = localStorage.getItem('firstName') ?? ''
    const lastName = localStorage.getItem('lastName') ?? ''
    const role = localStorage.getItem('role') ?? ''
  
    return {
      name: `${firstName} ${lastName}`,
      role: role,
      initials: `${firstName.charAt(0)}${lastName.charAt(0)}`
    }
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

