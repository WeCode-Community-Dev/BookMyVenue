import { PaymentEntity } from "../../domain/entities/Payment.js";
export class PaymentMapper {

    static mapToEntity(document) {

        if (!document) return null;

        return new PaymentEntity({

            id: document._id.toString(),

            bookingId: document.bookingId,

            userId: document.userId,

            vendorId: document.vendorId,

            amount: document.amount,

            paymentType: document.paymentType,

            paymentMethod: document.paymentMethod,

            paymentStatus: document.paymentStatus,

            refundAmount: document.refundAmount,

            refundReason: document.refundReason,

            refundedAt: document.refundedAt,

            createdAt: document.createdAt,

            updatedAt: document.updatedAt

        });

    }

    static mapToPersistence(entity) {

        return {

            bookingId: entity.bookingId,

            userId: entity.userId,

            vendorId: entity.vendorId,

            amount: entity.amount,

            paymentType: entity.paymentType,

            paymentMethod: entity.paymentMethod,

            paymentStatus: entity.paymentStatus,

            refundAmount: entity.refundAmount,

            refundReason: entity.refundReason,

            refundedAt: entity.refundedAt

        };

    }

}