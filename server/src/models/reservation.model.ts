import mongoose, { Document, Schema } from "mongoose";
import { ReservationStatusEnum, ReservationStatusEnumType } from "../enums/reservation-enum";

export interface ReservationDocument extends Document {
  venue: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: ReservationStatusEnumType;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<ReservationDocument>(
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

    status: {
      type: String,
      enum: Object.values(ReservationStatusEnum),
      default: ReservationStatusEnum.PENDING,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// TTL: Mongo auto-removes a hold once expiresAt passes (the 10-minute window).
reservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Race guard: only one active (PENDING) hold can exist for a venue + exact slot.
reservationSchema.index(
  { venue: 1, startTime: 1, endTime: 1 },
  { unique: true, partialFilterExpression: { status: ReservationStatusEnum.PENDING } },
);

const ReservationModel = mongoose.model<ReservationDocument>("Reservation", reservationSchema);
export default ReservationModel;
