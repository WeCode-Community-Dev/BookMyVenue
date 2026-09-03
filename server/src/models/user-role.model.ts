import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

// Join table: one active row per user.
// A user is promoted to owner/admin by upserting a new row (or updating roleId).
// No role field on the User document — roles live here exclusively.
export interface IUserRole extends Document {
  userId: mongoose.Types.ObjectId;
  roleId: mongoose.Types.ObjectId;
  active: boolean;
  deleted: boolean;
}

const userRoleSchema = new Schema<IUserRole>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    roleId: { type: Schema.Types.ObjectId, ref: 'Roles', required: true },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userRoleSchema.index({ userId: 1, roleId: 1 }, { unique: true });

export const UserRoleModel = mongoose.model<IUserRole>('UserRoles', userRoleSchema, 'UserRoles');
