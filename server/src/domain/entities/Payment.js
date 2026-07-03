import { PaymentStatus } from "../enums/Payment.enum.js";
import { PaymentType } from "../enums/PaymentType.enum.js";
import { PaymentMethod } from "../enums/PaymentMethod.enum.js";

export class PaymentEntity {

    constructor({

        id = null,

        bookingId,

        userId,

        vendorId,

        amount,

        paymentType,

        paymentMethod,

        paymentStatus = PaymentStatus.PENDING,

        refundAmount = 0,

        refundReason = null,

        refundedAt = null,

        createdAt = new Date(),

        updatedAt = new Date()

    }) {

        this.id = id;

        this.bookingId = bookingId;

        this.userId = userId;

        this.vendorId = vendorId;

        this.amount = amount;

        this.paymentType = paymentType;

        this.paymentMethod = paymentMethod;

        this.paymentStatus = paymentStatus;

        this.refundAmount = refundAmount;

        this.refundReason = refundReason;

        this.refundedAt = refundedAt;

        this.createdAt = createdAt;

        this.updatedAt = updatedAt;

    }

}