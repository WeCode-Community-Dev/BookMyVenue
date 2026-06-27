import { BookingStatus } from "../enums/Booking.enum.js";
import { PaymentStatus } from "../enums/Payment.enum.js";

export class Booking {
  constructor({
    id = null,
    userId,
    venueId,
    vendorId,
    bookingDate,
    startTime,
    endTime,
    guestCount,
    totalAmount,
    advanceAmount = 0,
    paidAmount = 0,
    remainingAmount = totalAmount,
    status = BookingStatus.PENDING,
    paymentStatus = PaymentStatus.PENDING,
    cancellationReason = null,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.userId = userId;
    this.venueId = venueId;
    this.vendorId = vendorId;
    this.bookingDate = bookingDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.guestCount = guestCount;
    this.totalAmount = totalAmount;
    this.advanceAmount = advanceAmount;
    this.paidAmount = paidAmount;
    this.remainingAmount = remainingAmount;
    this.status = status;
    this.paymentStatus = paymentStatus;
    this.cancellationReason = cancellationReason;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  payAmount(amount) {
    this.paidAmount += amount;

    if (this.paidAmount >= this.totalAmount) {
      this.paidAmount = this.totalAmount;
      this.remainingAmount = 0;
      this.paymentStatus = PaymentStatus.PAID;
    } else {
      this.remainingAmount = this.totalAmount - this.paidAmount;
      this.paymentStatus = PaymentStatus.PARTIAL;
    }

    this.touch();
  }

  canPayBalance(today = new Date()) {
    const eventDate = new Date(this.bookingDate);
    const deadline = new Date(eventDate);

    deadline.setDate(deadline.getDate() - 2);

    return today <= deadline;
  }

  payBalance(amount) {
    if (!this.canPayBalance()) {
      throw new Error("Balance payment must be paid at least 2 days before the event");
    }

    if (amount !== this.remainingAmount) {
      throw new Error("Balance payment amount must match remaining amount");
    }

    this.payAmount(amount);
  }

  markPaymentFailed() {
    this.paymentStatus = PaymentStatus.FAILED;
    this.touch();
  }

  confirm() {
    if (this.status === BookingStatus.CANCELLED) {
      throw new Error("Cancelled booking cannot be confirmed");
    }

    if (this.status === BookingStatus.REJECTED) {
      throw new Error("Rejected booking cannot be confirmed");
    }

    if (
      this.paymentStatus !== PaymentStatus.PARTIAL &&
      this.paymentStatus !== PaymentStatus.PAID
    ) {
      throw new Error("Booking cannot be confirmed before advance payment");
    }

    this.status = BookingStatus.CONFIRMED;
    this.touch();
  }

  reject() {
    if (this.status === BookingStatus.COMPLETED) {
      throw new Error("Completed booking cannot be rejected");
    }

    if (this.status === BookingStatus.CANCELLED) {
      throw new Error("Cancelled booking cannot be rejected");
    }

    if (this.status === BookingStatus.REJECTED) {
      return;
    }

    this.status = BookingStatus.REJECTED;
    this.touch();
  }

  cancel(reason = null) {
    if (this.status === BookingStatus.COMPLETED) {
      throw new Error("Completed booking cannot be cancelled");
    }

    if (this.status === BookingStatus.CANCELLED) {
      return;
    }

    this.status = BookingStatus.CANCELLED;
    this.cancellationReason = reason;
    this.touch();
  }

  complete() {
    if (this.status === BookingStatus.COMPLETED) {
      return;
    }

    if (this.status !== BookingStatus.CONFIRMED) {
      throw new Error("Only confirmed booking can be completed");
    }

    if (this.paymentStatus !== PaymentStatus.PAID) {
      throw new Error("Booking cannot be completed before full payment");
    }

    this.status = BookingStatus.COMPLETED;
    this.touch();
  }

  refund() {
    if (this.paymentStatus === PaymentStatus.REFUNDED) {
      return;
    }

    if (
      this.paymentStatus !== PaymentStatus.PAID &&
      this.paymentStatus !== PaymentStatus.PARTIAL
    ) {
      throw new Error("Only paid bookings can be refunded");
    }

    this.paymentStatus = PaymentStatus.REFUNDED;
    this.touch();
  }

  touch() {
    this.updatedAt = new Date();
  }
}