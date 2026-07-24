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
