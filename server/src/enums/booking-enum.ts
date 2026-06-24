export const BookingStatusEnum = {
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
  PENDING: "PENDING",
  REFUNDED: "REFUNDED",
};

export type BookingStatusEnumType = (typeof BookingStatusEnum)[keyof typeof BookingStatusEnum];
