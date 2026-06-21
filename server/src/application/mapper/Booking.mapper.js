import { Booking } from "../../domain/entities/Booking.js";

export class BookingMapper {

    static mapToEntity(doc) {

        if (!doc) return null;

        return new Booking({

            id: doc._id?.toString(),

            userId: doc.userId,

            venueId: doc.venueId,

            ownerId: doc.ownerId,

            bookingDate: doc.bookingDate,

            startTime: doc.startTime,

            endTime: doc.endTime,

            guestCount: doc.guestCount,

            totalAmount: doc.totalAmount,

            advanceAmount: doc.advanceAmount,

            paidAmount: doc.paidAmount,

            remainingAmount: doc.remainingAmount,

            status: doc.status,

            paymentStatus: doc.paymentStatus,

            cancellationReason: doc.cancellationReason,

            createdAt: doc.createdAt,

            updatedAt: doc.updatedAt

        });

    }

    static mapToPersistence(entity) {

        if (!entity) return null;

        return {

            userId: entity.userId,

            venueId: entity.venueId,

            ownerId: entity.ownerId,

            bookingDate: entity.bookingDate,

            startTime: entity.startTime,

            endTime: entity.endTime,

            guestCount: entity.guestCount,

            totalAmount: entity.totalAmount,

            advanceAmount: entity.advanceAmount,

            paidAmount: entity.paidAmount,

            remainingAmount: entity.remainingAmount,

            status: entity.status,

            paymentStatus: entity.paymentStatus,

            cancellationReason: entity.cancellationReason

        };

    }

}