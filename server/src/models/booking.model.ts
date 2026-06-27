import mongoose, { Document, Schema } from "mongoose";
import { BookingStatusEnum, BookingStatusEnumType } from "../enums/booking-enum";

export interface BookingDocument extends Document {
  venue: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  bookingStatus: BookingStatusEnumType;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<BookingDocument>(
  {
    venue: {
      type: Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    bookingStatus: {
      type: String,
      enum: Object.values(BookingStatusEnum),
      default: BookingStatusEnum.CONFIRMED,
    },
  },
  {
    timestamps: true,
  },
);

const BookingModel = mongoose.model<BookingDocument>("Booking", bookingSchema);
export default BookingModel;
