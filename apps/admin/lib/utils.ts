import { BookingStatus, VerificationStatus } from "@bookmyvenue/database/enums";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmtAmount(n: number) {
    return "₹" + n.toLocaleString("en-IN");
}

export const fromSmallUnit = (amount: number) => amount / 100;


export const BOOKING_STATUS_STYLE: Record<BookingStatus, string> = {
    CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

export const VENUE_STATUS_STYLE: Record<VerificationStatus, string> = {
    [VerificationStatus.APPROVED]: "bg-emerald-50 text-emerald-700 border-emerald-200",
    [VerificationStatus.PENDING]: "bg-amber-50 text-amber-700 border-amber-200",
    [VerificationStatus.REJECTED]: "bg-red-50 text-red-600 border-red-200",
};

export const VENUE_STATUS_LABEL: Record<VerificationStatus, string> = {
    [VerificationStatus.APPROVED]: "Approved",
    [VerificationStatus.PENDING]: "Pending",
    [VerificationStatus.REJECTED]: "Rejected",
};