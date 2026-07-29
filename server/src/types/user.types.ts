import { HydratedDocument } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'user' | 'owner';
  isBlocked: boolean;
  authProvider: 'google' | 'local';
  isVerified: boolean;
  googleId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;
