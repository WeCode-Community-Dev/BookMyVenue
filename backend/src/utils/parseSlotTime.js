const SLOT_TIME_REGEX =
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;

/**
 * Parses a 12-hour slot time string (e.g. "09:00 AM") to minutes from midnight.
 * Returns null when the value is invalid.
 */
export const parseSlotTimeToMinutes = (value) => {
    if (value == null || typeof value !== "string") {
        return null;
    }

    const trimmed = value.trim();
    const match = trimmed.match(SLOT_TIME_REGEX);

    if (!match) {
        return null;
    }

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3].toUpperCase();

    if (
        !Number.isInteger(hours) ||
        !Number.isInteger(minutes) ||
        hours < 1 ||
        hours > 12 ||
        minutes < 0 ||
        minutes > 59
    ) {
        return null;
    }

    if (meridiem === "PM" && hours !== 12) {
        hours += 12;
    }

    if (meridiem === "AM" && hours === 12) {
        hours = 0;
    }

    return hours * 60 + minutes;
};

export const isValidSlotTime = (value) =>
    parseSlotTimeToMinutes(value) !== null;
