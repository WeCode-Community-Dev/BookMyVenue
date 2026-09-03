import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface IRolePermission extends Document {
  roleId: mongoose.Types.ObjectId;
  permissionId: mongoose.Types.ObjectId;
  active: boolean;
  deleted: boolean;
}

const rolePermissionSchema = new Schema<IRolePermission>(
  {
    roleId: { type: Schema.Types.ObjectId, ref: 'Roles', required: true },
    permissionId: { type: Schema.Types.ObjectId, ref: 'Permissions', required: true },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One grant per role/permission pair
rolePermissionSchema.index({ roleId: 1, permissionId: 1 }, { unique: true });

export const RolePermissionModel = mongoose.model<IRolePermission>(
  'RolePermissions',
  rolePermissionSchema,
  'RolePermissions'
);
