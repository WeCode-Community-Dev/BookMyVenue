import mongoose from "mongoose";
import { BookingStatus } from "../../../domain/enums/Booking.enum.js";
import { PaymentStatus } from "../../../domain/enums/Payment.enum.js";

const bookingSchema = new mongoose.Schema(

    {
        userId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        venueId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Venue",

            required: true

        },

        vendorId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Vendor",

            required: true

        },

        bookingDate: {

            type: Date,

            required: true

        },

        startTime: {

            type: String,

            required: true

        },

        endTime: {

            type: String,

            required: true

        },

        guestCount: {

            type: Number,

            required: true

        },

        totalAmount: {

            type: Number,

            required: true

        },

        advanceAmount: {

            type: Number,

            default: 0

        },

        paidAmount: {

            type: Number,

            default: 0

        },

        remainingAmount: {

            type: Number,

            required: true

        },

        status: {

            type: String,

            enum: Object.values(BookingStatus),

            default: BookingStatus.PENDING

        },

        paymentStatus: {

            type: String,

            enum: Object.values(PaymentStatus),

            default: PaymentStatus.PENDING

        },

        cancellationReason: {

            type: String,

            default: null

        },

    },

    {

        timestamps: true

    }

)

export const BookingModel = mongoose.model(

    "Booking",

    bookingSchema

)