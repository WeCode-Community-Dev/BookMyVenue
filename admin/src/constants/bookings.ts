export const BOOKING_REF_PREFIX = "BMV-";

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-800",
  PAID: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export const FEATURE_DURATION_OPTIONS = [
  { value: "7", label: "7 Days" },
  { value: "30", label: "30 Days" },
  { value: "indefinite", label: "Indefinitely" },
] as const;
