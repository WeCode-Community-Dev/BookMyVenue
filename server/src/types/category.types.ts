import { HydratedDocument } from 'mongoose';

export interface ICategory {
  name: string;
  description: string;
  imageUrl?: string | null;
  image_public_id?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CategoryDocument = HydratedDocument<ICategory>;
