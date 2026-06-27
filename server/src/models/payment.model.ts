import mongoose, { Document } from "mongoose";
import {
  PaymentStatusEnum,
  PaymentStatusEnumType,
  ProviderEnum,
  ProviderEnumType,
} from "../enums/payment.enum";

export interface PaymentDocument extends Document {
  booking?: mongoose.Types.ObjectId;
  reservation?: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  amount: number;
  provider: ProviderEnumType;
  transactionId: string;
  paymentStatus: PaymentStatusEnumType;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new mongoose.Schema<PaymentDocument>(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    provider: {
      type: String,
      enum: Object.values(ProviderEnum),
    },
    transactionId: String,
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatusEnum),
      default: PaymentStatusEnum.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

export const PaymentModel = mongoose.model<PaymentDocument>("Payment", paymentSchema);
export default PaymentModel;
