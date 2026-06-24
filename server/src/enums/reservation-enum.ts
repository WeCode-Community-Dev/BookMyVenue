export const ReservationStatusEnum = {
  PENDING: "PENDING",
  EXPIRED: "EXPIRED",
  COMPLETED: "COMPLETED",
};

export type ReservationStatusEnumType =
  (typeof ReservationStatusEnum)[keyof typeof ReservationStatusEnum];
