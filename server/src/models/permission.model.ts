import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { ActionEnum, EntityEnum } from '../constants/permissions';
import type { IAction, IEntity } from '../constants/permissions';

export interface IPermission extends Document {
  action: IAction;
  entity: IEntity;
  isSystem: boolean;
  active: boolean;
  deleted: boolean;
}

const permissionSchema = new Schema<IPermission>(
  {
    action: { type: String, required: true, enum: ActionEnum as unknown as string[] },
    entity: { type: String, required: true, enum: EntityEnum as unknown as string[] },
    isSystem: { type: Boolean, default: false, immutable: true },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Composite unique — one row per action/entity combination
permissionSchema.index({ action: 1, entity: 1 }, { unique: true });

export const PermissionModel = mongoose.model<IPermission>(
  'Permissions',
  permissionSchema,
  'Permissions'
);
