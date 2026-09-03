import mongoose, { Schema } from 'mongoose';
import type { Document } from 'mongoose';

export interface IIdempotencyKey extends Document {
  key: string;
  response: { status: number; body: unknown };
  createdAt: Date;
}

const IdempotencyKeySchema = new Schema<IIdempotencyKey>({
  key: { type: String, required: true, unique: true, index: true },
  response: {
    status: { type: Number, required: true },
    body: { type: Schema.Types.Mixed, required: true },
  },
  createdAt: { type: Date, default: Date.now, index: { expires: 86400 } },
});

export const IdempotencyKeyModel = mongoose.model<IIdempotencyKey>(
  'IdempotencyKeys',
  IdempotencyKeySchema,
  'IdempotencyKeys'
);
