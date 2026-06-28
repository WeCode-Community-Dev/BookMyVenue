export type SpaceManageTab =
  | "overview"
  | "availability"
  | "pricing"
  | "amenities"
  | "photos"
  | "bookings"
  | "settings";

export type SpaceManageTabIcon =
  | "layout-grid"
  | "calendar-clock"
  | "tag"
  | "sparkles"
  | "images"
  | "calendar-days"
  | "settings";

export const SPACE_MANAGE_TABS: {
  id: SpaceManageTab;
  label: string;
  icon: SpaceManageTabIcon;
}[] = [
  { id: "overview", label: "Overview", icon: "layout-grid" },
  { id: "availability", label: "Availability", icon: "calendar-clock" },
  { id: "pricing", label: "Pricing", icon: "tag" },
  { id: "amenities", label: "Amenities", icon: "sparkles" },
  { id: "photos", label: "Photos", icon: "images" },
  { id: "bookings", label: "Bookings", icon: "calendar-days" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export const spaceManageDummy = {
  spaceType: "Indoor Premium",
  upcomingBookings: 12,
};

export type SpaceManageActivityIcon =
  | "bell"
  | "refresh-cw"
  | "upload"
  | "message-square";

export type SpaceManageActivityItem = {
  title: string;
  detail: string;
  timeAgo: string;
  icon: SpaceManageActivityIcon;
  iconClassName: string;
};

export const spaceManageActivity: SpaceManageActivityItem[] = [
  {
    title: "Booking received",
    detail: "for Q3 Sales Kickoff",
    timeAgo: "2 hours ago",
    icon: "bell",
    iconClassName: "bg-blue-100 text-blue-600",
  },
  {
    title: "Availability updated",
    detail: "for Holiday Season",
    timeAgo: "Yesterday, 4:15 PM",
    icon: "refresh-cw",
    iconClassName: "bg-purple-100 text-purple-600",
  },
  {
    title: "4 new photos uploaded",
    detail: "to gallery",
    timeAgo: "3 days ago",
    icon: "upload",
    iconClassName: "bg-gray-100 text-gray-600",
  },
  {
    title: "New 5-star review",
    detail: "from Apex Corp",
    timeAgo: "Last week",
    icon: "message-square",
    iconClassName: "bg-orange-100 text-orange-600",
  },
];

export type SpaceManageQuickActionIcon = "eye" | "share-2" | "archive";

export type SpaceManageQuickAction = {
  label: string;
  icon: SpaceManageQuickActionIcon;
  variant?: "default" | "destructive";
  href?: string;
};

export const spaceManageSupport = {
  title: "Need help?",
  description:
    "Our dedicated venue support team is available 24/7 to help you manage your spaces and bookings.",
  ctaLabel: "Contact Support",
};

export function getSpaceDisplayCode(spaceId: string): string {
  const segment = spaceId.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `#SP-${segment}`;
}

export function formatSpaceCapacityLabel(
  capacityValue: string | null,
  capacityType: string | null,
): string {
  if (!capacityValue) {
    return "—";
  }
  const value = parseFloat(capacityValue);
  const formatted = Number.isNaN(value)
    ? capacityValue
    : `${Math.round(value)}`;
  if (!capacityType) {
    return formatted;
  }
  const typeLabel =
    capacityType === "PEOPLE"
      ? "People"
      : capacityType.charAt(0) + capacityType.slice(1).toLowerCase();
  return `${formatted} ${typeLabel}`;
}

export function formatRelativeUpdatedAt(updatedAt: string): string {
  const diffMs = Date.now() - new Date(updatedAt).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}
