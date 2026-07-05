import { Heart, Building2, PartyPopper, Briefcase, Sparkles } from "lucide-react";
import { BookingStatus, VerificationStatus } from "@bookmyvenue/database";

export const CATEGORIES = [
    { label: "Weddings", icon: Heart, count: "240+ venues" },
    { label: "Conferences", icon: Building2, count: "85+ venues" },
    { label: "Parties", icon: PartyPopper, count: "130+ venues" },
    { label: "Corporate", icon: Briefcase, count: "60+ venues" },
    { label: "Events", icon: Sparkles, count: "180+ venues" },
];

export const STATUS_STYLE: Record<BookingStatus | VerificationStatus, string> = {
    APPROVED: "bg-emerald-200 text-emerald-700 border-emerald-700",
    CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-200",
    REJECTED: "bg-red-200 text-red-600 border-red-700",
};

export const STATUS_DOT: Record<BookingStatus, string> = {
    CONFIRMED: "bg-emerald-500",
    PENDING: "bg-amber-400",
    CANCELLED: "bg-red-500",
};
