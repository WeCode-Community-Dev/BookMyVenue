
export const writeReviewSchema = {
    body: {
        type: "object",
        required: ["venueId", "rating"],
        additionalProperties: false,
        properties: {
            venueId: { type: "integer", minimum: 1 },
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string", minLength: 3, maxLength: 500 },
        },
    },
};