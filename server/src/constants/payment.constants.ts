export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
} as const;
export type PaymentStatusType = (typeof PaymentStatus)[keyof typeof PaymentStatus];
