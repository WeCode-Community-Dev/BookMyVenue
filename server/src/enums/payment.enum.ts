export const ProviderEnum = {
  RAZORPAY: "RAZORPAY",
  STRIPE: "STRIPE",
  DUMMY: "DUMMY",
};

export const PaymentStatusEnum = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
};

export type ProviderEnumType = (typeof ProviderEnum)[keyof typeof ProviderEnum];
export type PaymentStatusEnumType = (typeof PaymentStatusEnum)[keyof typeof PaymentStatusEnum];
