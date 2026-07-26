import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  active: boolean;
  deleted: boolean;
  passwordChangedAt?: Date | null;
  isBanned: boolean;
  profilePicture?: string;
  profilePicturePublicId?: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
    passwordChangedAt: { type: Date, default: null },
    isBanned: { type: Boolean, default: false, index: true },
    profilePicture: { type: String },
    profilePicturePublicId: { type: String },
  },
  { timestamps: true }
);

UserSchema.index(
  { email: 1 },
  { unique: true, sparse: true, partialFilterExpression: { active: true } }
);

UserSchema.index({ active: 1, deleted: 1, isBanned: 1 }, { name: 'idx_active_deleted_banned' });

export const UserModel = mongoose.model<IUser>('Users', UserSchema, 'Users');
