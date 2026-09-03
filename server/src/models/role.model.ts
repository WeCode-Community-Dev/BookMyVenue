import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

// Kept open-ended so new roles can be inserted into the DB without a schema change.
// The enum below reflects the four system roles shipped at launch.
export const RoleEnum = ['user', 'owner', 'admin', 'superAdmin'] as const;
export type RoleName = (typeof RoleEnum)[number];

export interface IRole extends Document {
  name: string; // string (not narrowed to RoleEnum) to allow future roles without a migration
  displayName: string;
  description?: string;
  isSystem: boolean; // true for the four built-in roles
  parentRole: mongoose.Types.ObjectId | null; // drives $graphLookup inheritance
  priority: number; // lower = higher rank; superAdmin=1, admin=20, owner=50, user=100
  active: boolean;
  deleted: boolean;
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    description: { type: String, default: '' },
    isSystem: { type: Boolean, default: false, immutable: true },
    parentRole: { type: Schema.Types.ObjectId, ref: 'Roles', default: null },
    priority: { type: Number, required: true },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

roleSchema.index({ name: 1, _id: 1 });
roleSchema.index({ priority: 1 });

export const RoleModel = mongoose.model<IRole>('Roles', roleSchema, 'Roles');
