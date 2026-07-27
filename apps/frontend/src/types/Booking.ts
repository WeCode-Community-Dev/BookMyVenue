import { Venue } from "./Venue";

export interface BookingSlot {
    id: string;
    eventDate: string;
    slotTemplate: {
        id: string;
        label: string;
        startTime: string;
        endTime: string;
    };
}

export interface UserBooking {
    id: string;
    totalPrice: string;
    status: "PENDING_PAYMENT" | "CONFIRMED" | "EXPIRED" | "REFUNDED" | "CANCELLED";
    createdAt: string;
    venue: {
        id: string;
        name: string;
        addressLine: string;
        city: string;
        images: Array<{
            url: string;
            isPrimary: boolean;
        }>;
    };
    slots: BookingSlot[];
}

export interface BookingItem {
    id: number | string;
    day: string;
    month: string;
    title: string;
    time: string;
    guests: string;
    price: number | string;
}

export interface BookingSummaryProps {
    venue?: Venue | null;
    isProfileConfirmed?: boolean;
    onProceedToPayment?: () => void;
    bookings?: BookingItem[];
    isPaying?: boolean;
    paymentError?: string | null;
}

export interface PackageCardProps {
    date: string;
    title: string;
    time: string;
    guests: string;
    price: string;
    available?: string;
    selected?: boolean;
    evening?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}
