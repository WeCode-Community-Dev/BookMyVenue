import mongoose, { type Document, Schema } from 'mongoose';

export interface IVenueDraft extends Document {
  userId: mongoose.Types.ObjectId;
  step: number;
  formValues: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const venueDraftSchema = new Schema<IVenueDraft>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Only one draft per user
    },
    step: {
      type: Number,
      required: true,
      default: 0,
    },
    formValues: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export const VenueDraftModel = mongoose.model<IVenueDraft>('VenueDraft', venueDraftSchema);
