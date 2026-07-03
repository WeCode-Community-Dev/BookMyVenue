import mongoose, { Schema, Types } from 'mongoose';
import { PaymentStatus } from "../../../domain/enums/Payment.enum.js";
import { PaymentMethod } from '../../../domain/enums/PaymentMethod.enum.js';
import { PaymentType } from '../../../domain/enums/PaymentType.enum.js';

const paymentSchema = new mongoose.Schema(

    {

        bookingId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Booking",

            required: true

        },

        userId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        vendorId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Vendor",

            required: true

        },

        amount: {

            type: Number,

            required: true

        },

        paymentType: {

            type: String,

            enum: Object.values(PaymentType),

            required: true

        },

        paymentMethod: {

            type: String,

            enum: Object.values(PaymentMethod),

            required: true

        },

        paymentStatus: {

            type: String,

            enum: Object.values(PaymentStatus),

            default: PaymentStatus.PENDING

        },

        refundAmount: {

            type: Number,

            default: 0

        },

        refundReason: {

            type: String,

            default: null

        },

        refundedAt: {

            type: Date,

            default: null

        }

    },

    {

        timestamps: true

    }

);

export const PaymentModel = mongoose.model(

    "Payment",

    paymentSchema

);