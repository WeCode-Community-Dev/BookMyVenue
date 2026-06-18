import mongoose from "mongoose";

const venueAvailabilitySchema = new mongoose.Schema(
    {
        venueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Venue",
            required: true,
        },

        date: {
            type: Date,
            required: true,
        },

        slotLabel: {
            type: String,
            enum: ["morning", "evening", "night", "fullday"],
            required: true,
        },

        startTime: {
            type: String,
            required: true,
        },

        endTime: {
            type: String,
            required: true,
        },

        isBooked: {
            type: Boolean,
            default: false,
        },

        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const venueAvailabilityModel = mongoose.model("VenueAvailability",venueAvailabilitySchema
);

export default venueAvailabilityModel;