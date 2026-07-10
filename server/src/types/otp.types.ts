import { HydratedDocument } from 'mongoose';

export interface IOTP {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type OTPDocument = HydratedDocument<IOTP>;
