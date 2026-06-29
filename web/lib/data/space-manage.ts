import type {
  PricingType,
  SpacePricingResponse,
} from "@/services/venueServices";

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

export const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DEFAULT_OPERATING_HOURS = {
  openTime: "09:00",
  closeTime: "17:00",
} as const;

export const availabilityProTip = {
  title: "Pro Tip",
  body: "Setting regular business hours helps our algorithm recommend your space to high-value corporate clients during peak times.",
};

export type OperatingHourRow = {
  weekday: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function computeWeeklyCapacityHours(
  hours: Pick<OperatingHourRow, "openTime" | "closeTime" | "isClosed">[],
): number {
  const totalMinutes = hours.reduce((sum, row) => {
    if (row.isClosed) return sum;
    const open = parseTimeToMinutes(row.openTime);
    const close = parseTimeToMinutes(row.closeTime);
    if (close <= open) return sum;
    return sum + (close - open);
  }, 0);
  return Math.round(totalMinutes / 60);
}

export function createDefaultOperatingHours(): OperatingHourRow[] {
  return WEEKDAY_LABELS.map((_, weekday) => ({
    weekday,
    openTime: DEFAULT_OPERATING_HOURS.openTime,
    closeTime: DEFAULT_OPERATING_HOURS.closeTime,
    isClosed: false,
  }));
}

export function formatBlockedPeriodDate(isoDate: string): string {
  const date = new Date(isoDate);
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = date.getDate();
  return `${month} ${day}`;
}

export function isAllDayBlock(startAt: string, endAt: string): boolean {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();
  if (!sameDay) return false;
  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();
  return startMinutes === 0 && endMinutes >= 23 * 60 + 59;
}

export function formatBlockedPeriodTimeRange(
  startAt: string,
  endAt: string,
): string {
  if (isAllDayBlock(startAt, endAt)) {
    return "All Day";
  }
  const start = new Date(startAt);
  const end = new Date(endAt);
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  return `${formatTime(start)} → ${formatTime(end)}`;
}

export function formatNextBlockedDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function toDateInputValue(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toTimeInputValue(isoDate: string): string {
  const date = new Date(isoDate);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function buildBlockPeriodIsoStrings(
  date: string,
  startTime: string,
  endTime: string,
  allDay: boolean,
): { startAt: string; endAt: string } {
  if (allDay) {
    return {
      startAt: new Date(`${date}T00:00:00`).toISOString(),
      endAt: new Date(`${date}T23:59:59.999`).toISOString(),
    };
  }
  return {
    startAt: new Date(`${date}T${startTime}:00`).toISOString(),
    endAt: new Date(`${date}T${endTime}:00`).toISOString(),
  };
}

export type PricingModelId =
  | "hourly"
  | "daily"
  | "event"
  | "session"
  | "custom";

export type PricingFormState = {
  model: PricingModelId;
  amount: string;
  currency: string;
  minBooking: string;
  maxBooking: string;
};

export const DEFAULT_CURRENCY = "INR";

export const SUPPORTED_CURRENCIES = ["INR", "USD", "EUR", "GBP"] as const;

export const PRICING_MODEL_OPTIONS: {
  id: PricingModelId;
  label: string;
  description: string;
  pricingType: PricingType;
}[] = [
  {
    id: "hourly",
    label: "Per Hour",
    description: "Charge customers based on hours booked.",
    pricingType: "HOURLY",
  },
  {
    id: "daily",
    label: "Per Day",
    description: "Set a fixed price for full-day bookings.",
    pricingType: "DAILY",
  },
  // {
  //   id: "event",
  //   label: "Per Event",
  //   description: "One price for the entire event duration.",
  //   pricingType: "EVENT",
  // },
  // {
  //   id: "session",
  //   label: "Per Session",
  //   description: "Charge a fixed rate per booking session.",
  //   pricingType: "SESSION",
  // },
  {
    id: "custom",
    label: "Custom Quote",
    description: "Review requests and send a manual quote.",
    pricingType: "CUSTOM",
  },
];

export function createDefaultPricingFormState(): PricingFormState {
  return {
    model: "hourly",
    amount: "",
    currency: DEFAULT_CURRENCY,
    minBooking: "",
    maxBooking: "",
  };
}

export function pricingModelToApiType(id: PricingModelId): PricingType {
  const option = PRICING_MODEL_OPTIONS.find((item) => item.id === id);
  return option?.pricingType ?? "HOURLY";
}

export function apiTypeToPricingModel(type: PricingType): PricingModelId {
  const option = PRICING_MODEL_OPTIONS.find((item) => item.pricingType === type);
  return option?.id ?? "hourly";
}

export function mapPricingResponseToForm(
  record: SpacePricingResponse,
): PricingFormState {
  return {
    model: apiTypeToPricingModel(record.pricingType),
    amount: record.pricingType === "CUSTOM" ? "" : record.amount,
    currency: record.currency,
    minBooking: record.minBooking != null ? String(record.minBooking) : "",
    maxBooking: record.maxBooking != null ? String(record.maxBooking) : "",
  };
}

export function resolvePricingFormFromRecords(
  records: SpacePricingResponse[],
): PricingFormState {
  if (records.length === 0) {
    return createDefaultPricingFormState();
  }

  const latest = [...records].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];

  return mapPricingResponseToForm(latest);
}
