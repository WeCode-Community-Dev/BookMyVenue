import { BookingStatus } from "@bookmyvenue/database";

export const createBookingSchema = {
    body: {
        type: "object",
        required: ["venueId", "sessionIds", "eventDate", "phone"],
        properties: {
            venueId: { type: "integer", minimum: 1 },
            sessionIds: {
                type: "array",
                items: { type: "integer", minimum: 1 },
                minItems: 1,
                uniqueItems: true,
            },
            eventDate: { type: "string", format: "date" },
            phone: { type: "string", minLength: 10 },
            purpose: { type: "string" },
        },
    },
};

export const getBookingsByIdSchema = {
    querystring: {
        type: "object",
        properties: {
            status: { type: "string", enum: Object.values(BookingStatus) },
            page: { type: "integer", minimum: 1, default: 1 },
            limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
            today: { type: "string" },
            type: { type: "string", enum: ["UPCOMING", "HISTORY"] },
        },
    },
};
