import mongoose from "mongoose";

const paymentOrderSchema = new mongoose.Schema(
    {
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
        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
        },
        amountInPaise: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["created", "completed"],
            default: "created",
        },
    },
    {
        timestamps: true,
    }
);

const paymentOrderModel = mongoose.model("PaymentOrder", paymentOrderSchema);

export default paymentOrderModel;
