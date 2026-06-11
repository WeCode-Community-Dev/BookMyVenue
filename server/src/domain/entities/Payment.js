import { PaymentStatus } from "../enums/Payment.enum.js";
import { PaymentType } from "../enums/PaymentType.enum.js";
import { PaymentMethod } from "../enums/PaymentMethod.enum.js";

export class Payment {
  constructor({
    id = null,
    bookingId,
    userId,
    ownerId,
    amount,
    paymentType,
    paymentMethod,
    status = PaymentStatus.PENDING,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.bookingId = bookingId;
    this.userId = userId;
    this.ownerId = ownerId;
    this.amount = amount;
    this.paymentType = paymentType;
    this.paymentMethod = paymentMethod;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  markAsPaid() {
    this.status = PaymentStatus.PAID;
    this.touch();
  }

  markFailed() {
    this.status = PaymentStatus.FAILED;
    this.touch();
  }

  refund() {
    if (this.status === PaymentStatus.REFUNDED) {
      return;
    }

    if (this.status !== PaymentStatus.PAID) {
      throw new Error("Only paid payments can be refunded");
    }

    this.status = PaymentStatus.REFUNDED;
    this.touch();
  }

  touch() {
    this.updatedAt = new Date();
  }
}