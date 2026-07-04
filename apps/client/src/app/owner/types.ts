import { BookingStatus } from "@bookmyvenue/database";

export const STATUS_STYLE: Record<BookingStatus, string> = {
    CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

export const STATUS_DOT: Record<BookingStatus, string> = {
    CONFIRMED: "bg-emerald-500",
    PENDING: "bg-amber-400",
    CANCELLED: "bg-red-500",
};
