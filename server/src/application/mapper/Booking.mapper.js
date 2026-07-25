import { Types } from "mongoose";
import { Booking } from "../../domain/entities/Booking.js";

export class BookingMapper {
  static mapToEntity(doc) {
    if (!doc) return null;

    return new Booking({
      id: doc._id ? doc._id.toString() : null,

      // userId: doc.userId ? doc.userId.toString() : null,

      //venueId: doc.venueId ? doc.venueId.toString() : null,

      // vendorId: doc. vendorId? doc.vendorId.toString() : null,
      userId: doc.userId
        ? {
            id: doc.userId._id?.toString(),
            fullName: doc.userId.fullName,
            email: doc.userId.email,
            phone: doc.userId.phone,
          }
        : null,
      vendorId: doc.vendorId
        ? {
            id: doc.vendorId._id?.toString(),
            fullName: doc.vendorId.fullName,
            email: doc.vendorId.email,
            phone: doc.vendorId.phone,
            companyName: doc.vendorId.companyName,
          }
        : null,
      venueId: doc.venueId
        ? {
            id: doc.venueId._id?.toString(),
            name: doc.venueId.name,
            category: doc.venueId.category,
            address: doc.venueId.address,
            seatingCapacity: doc.venueId.seatingCapacity,
            standingCapacity: doc.venueId.standingCapacity,
            images: doc.venueId.images,
          }
        : null,

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

      updatedAt: doc.updatedAt,
    });
  }

  static mapToPersistence(entity) {
    if (!entity) return null;

    return {
      userId: entity.userId ? new Types.ObjectId(entity.userId) : null,

      venueId: entity.venueId ? new Types.ObjectId(entity.venueId) : null,

      vendorId: entity.vendorId ? new Types.ObjectId(entity.vendorId) : null,

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

      cancellationReason: entity.cancellationReason,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
