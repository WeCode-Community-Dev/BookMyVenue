import type { Document, Types } from 'mongoose';

export interface IContractPackage {
  pkgName: string;
  pkgType: 'fixed' | 'flexible';
  startTime: number;
  endTime: number;
  price: number;
}

export interface IContractFinancial {
  basePrice: number;
  taxes: number;
  platformFee: number;
  totalPaid: number;
}

export interface IContractCancellation {
  policy: 'refundable' | 'nonRefundable';
  refundType?: 'fullRefund' | 'timeBasedRefund';
  refundRules: {
    daysBefore: number;
    refundPercentage: number;
  }[];
}

export interface IContractSnapshot {
  venue: {
    name: string;
    city: string;
    district: string;
  };
  packages: IContractPackage[];
  financial: IContractFinancial;
  cancellation: IContractCancellation;
}

export interface ILock extends Document {
  venueId: Types.ObjectId;
  userId: Types.ObjectId;
  date: string;
  startTime: number;
  endTime: number;
  price: number;
  sessionTokenHash?: string;
  guestCount?: number;
  eventType?: string;
  bookerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    place?: string;
    note?: string;
  };
  contractSnapshot?: IContractSnapshot;
  createdAt: Date;
}
