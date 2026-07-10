export const VENUE_CATEGORY_SLUGS = [
    "wedding",
    "corporate",
    "birthday",
    "party",
    "function",
    "photoshoot",
    "other",
];

const LEGACY_CATEGORY_MAP = {
    meetings: "corporate",
    meeting: "corporate",
};

export const resolveVenueCategory = (value) => {
    if (value == null || typeof value !== "string") {
        return null;
    }

    const normalized = value.trim().toLowerCase();

    if (!normalized) {
        return null;
    }

    if (VENUE_CATEGORY_SLUGS.includes(normalized)) {
        return normalized;
    }

    if (LEGACY_CATEGORY_MAP[normalized]) {
        return LEGACY_CATEGORY_MAP[normalized];
    }

    return null;
};
