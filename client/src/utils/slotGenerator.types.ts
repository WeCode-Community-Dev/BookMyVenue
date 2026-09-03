export interface IPreviewSlot {
  id: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  name?: string;
  price: number;
  isAvailable: boolean;
  reason?: string;
}

export interface IFixedPackage {
  slotName: string;
  startTime: string;
  endTime: string;
  price: number;
}

export interface IPricingRule {
  fromTime: string;
  toTime: string;
  price: number;
}

export interface IBlockedTime {
  fromTime: string;
  toTime: string;
  reason?: string;
}

export interface IWorkingHours {
  open: string;
  close: string;
}

export interface ISlotConfig {
  bookingType: 'fixedBooking' | 'flexibleBooking';
  workingDays: string[];
  workingHours?: IWorkingHours;
  fixedPackages?: IFixedPackage[];
  slotDuration?: string;
  bufferTime?: string;
  pricingType?: string;
  pricingRules?: IPricingRule[];
  blockedTimes?: IBlockedTime[];
  samePrice?: string;
  basePrice?: string;
}
