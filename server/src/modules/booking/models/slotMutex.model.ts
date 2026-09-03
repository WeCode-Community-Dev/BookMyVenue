import mongoose, { Schema } from 'mongoose';

export interface ISlotMutex {
  venueId: mongoose.Types.ObjectId;
  date: string;
  lockedAt: Date;
}

const SlotMutexSchema = new Schema<ISlotMutex>({
  venueId: { type: Schema.Types.ObjectId, required: true },
  date: { type: String, required: true },
  lockedAt: { type: Date, required: true, default: Date.now, expires: 30 },
});

SlotMutexSchema.index({ venueId: 1, date: 1 }, { unique: true });

export const SlotMutexModel = mongoose.model<ISlotMutex>(
  'SlotMutexes',
  SlotMutexSchema,
  'SlotMutexes'
);
