export function getImageUrl(image) {
    if (!image) return "";

    if (typeof image === "string") return image;

    return image.url || image.image_url || "";
}

export function getTodayDate() {
    return new Date().toISOString().split("T")[0];
}

export function formatTime(dateString) {
    if (!dateString) return "Full Day";

    // Handle "HH:MM:SS" string from backend (Python time serialized as JSON)
    if (typeof dateString === "string" && dateString.match(/^\d{2}:\d{2}/)) {
        return dateString.slice(0, 5);
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
    });
}

export function calculateBookingSummary(
    venue,
    availabilityGroup,
    selectedSlotIds,
    selectedBookingType
) {
    if (
        !venue ||
        !availabilityGroup ||
        selectedSlotIds.length === 0
    ) {
        return null;
    }

    let basePrice = 0;

    if (selectedBookingType === "hourly") {
        basePrice =
            (venue.hourly_price || 0) * selectedSlotIds.length;
    } else if (selectedBookingType === "daily") {
        basePrice =
            (venue.daily_price || 0) * selectedSlotIds.length;
    }

    const taxAmount = basePrice * 0.12;
    const platformFee = 100;

    return {
        base_price: basePrice,
        tax_amount: taxAmount,
        platform_fee: platformFee,
        total_amount: basePrice + taxAmount + platformFee,
    };
}