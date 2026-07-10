import { Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  role: 'user' | 'owner' | 'admin';
  isVerified: boolean;
  isBlocked: boolean;
  googleId?: string;
  avatar?: string;
  authProvider?: 'local' | 'google';
  createdAt: Date;
  updatedAt: Date;
}
