import mongoose from "mongoose";


const bookingSchema = new mongoose.Schema(
    {
        bookingReference: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        venueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Venue",
            required: true,
        },
        availabilityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "VenueAvailability",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        bookingStatus: {
            type: String,
            enum: ["confirmed", "cancelled"],
            default: "confirmed",
        },
        paymentMethod: {
            type: String,
            default: null,
        },
        razorpayOrderId: {
            type: String,
            default: null,
        },
        paymentId: {
            type: String,
            default: null,
            unique: true,
            sparse: true,
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },

        contactPhone: {
            type: String,
            required: true,
        },

        bookedAt: {
            type: Date,
            default: Date.now,
        },

        cancelledAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

const bookingModel = mongoose.model("Bookings", bookingSchema);
export default bookingModel;