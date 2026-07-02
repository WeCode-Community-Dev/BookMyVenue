import { District, VenueCategory } from "@bookmyvenue/database";

export const createVenueSchema = {
    body: {
        type: "object",
        required: ["name", "description", "capacity", "category", "location", "district"],
        properties: {
            name: { type: "string", minLength: 2 },
            description: { type: "string", minLength: 10 },
            capacity: { type: "integer", minimum: 1 },
            category: { type: "string", enum: Object.values(VenueCategory) },
            location: { type: "string", minLength: 2 },
            district: { type: "string", enum: Object.values(District) },
            images: { type: "array", items: { type: "string" }, default: [] },
            amenities: { type: "array", items: { type: "string" }, default: [] },
            sessions: {
                type: "array",
                items: {
                    type: "object",
                    required: ["label", "startTime", "endTime", "price"],
                    properties: {
                        label: { type: "string", minLength: 1 },
                        startTime: { type: "string" },
                        endTime: { type: "string" },
                        price: { type: "integer", minimum: 0 },
                    },
                },
                default: [],
            },
        },
    },
};

export const getVenuesSchema = {
    querystring: {
        type: "object",
        properties: {
            district: { type: "string", enum: Object.values(District) },
            category: { type: "string", enum: Object.values(VenueCategory) },
            page: { type: "integer", minimum: 1, default: 1 },
            limit: { type: "integer", minimum: 1, maximum: 50, default: 10 },
        },
    },
};

const sessionProperties = {
    label: { type: "string", minLength: 1 },
    startTime: { type: "string" },
    endTime: { type: "string" },
    price: { type: "integer", minimum: 1 },
};

const existingSessionSchema = {
    type: "object",
    required: ["id", "label", "startTime", "endTime", "price", "isActive"],
    properties: {
        id: { type: "integer" },
        ...sessionProperties,
        isActive: { type: "boolean" },
    },
    additionalProperties: false,
};

const newSessionSchema = {
    type: "object",
    required: ["label", "startTime", "endTime", "price"],
    properties: {
        ...sessionProperties,
    },
    additionalProperties: false,
};

export const editVenueSchema = {
    body: {
        type: "object",
        additionalProperties: false,
        required: [
            "name",
            "description",
            "capacity",
            "category",
            "location",
            "district",
            "images",
            "amenities",
            "sessions",
        ],
        properties: {
            name: { type: "string", minLength: 2 },
            description: { type: "string", minLength: 10 },
            capacity: { type: "integer", minimum: 1 },
            category: { type: "string", enum: Object.values(VenueCategory) },
            location: { type: "string", minLength: 2 },
            district: { type: "string", enum: Object.values(District) },
            images: { type: "array", items: { type: "string" } },
            amenities: { type: "array", items: { type: "string" } },
            sessions: {
                type: "array",
                items: {
                    type: "object",
                    oneOf: [existingSessionSchema, newSessionSchema],
                },
            },
        },
    },
};
