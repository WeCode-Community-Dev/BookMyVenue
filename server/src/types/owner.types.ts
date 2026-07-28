import { HydratedDocument, Types } from 'mongoose';

export interface IOwner {
  userId: Types.ObjectId;
  idProof: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
  };
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verifiedAt: Date | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type OwnerDocument = HydratedDocument<IOwner>;
