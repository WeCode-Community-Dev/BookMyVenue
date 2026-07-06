import 'package:equatable/equatable.dart';

class BookingCheckoutResult extends Equatable {
  const BookingCheckoutResult({
    required this.bookingId,
    required this.amount,
    required this.razorpayOrderId,
    required this.razorpayKeyId,
    required this.lockExpiresAt,
  });

  final String bookingId;
  final double amount;
  final String razorpayOrderId;
  final String razorpayKeyId;
  final String lockExpiresAt;

  @override
  List<Object?> get props => <Object?>[
        bookingId,
        amount,
        razorpayOrderId,
        razorpayKeyId,
        lockExpiresAt,
      ];
}

class BookingDetailsEntity extends Equatable {
  const BookingDetailsEntity({
    required this.id,
    required this.venueId,
    required this.venueName,
    required this.bookingDate,
    required this.status,
    required this.amount,
    required this.lockExpiresAt,
    required this.createdAt,
    required this.slots,
  });

  final String id;
  final String venueId;
  final String venueName;
  final String bookingDate;
  final String status;
  final double amount;
  final String lockExpiresAt;
  final String createdAt;
  final List<BookingSlotEntity> slots;

  @override
  List<Object?> get props => <Object?>[
        id,
        venueId,
        venueName,
        bookingDate,
        status,
        amount,
        lockExpiresAt,
        createdAt,
        slots,
      ];
}

class BookingSlotEntity extends Equatable {
  const BookingSlotEntity({
    required this.id,
    required this.slotName,
    required this.startTime,
    required this.endTime,
    required this.price,
  });

  final String id;
  final String slotName;
  final String startTime;
  final String endTime;
  final double price;

  @override
  List<Object?> get props => <Object?>[id, slotName, startTime, endTime, price];
}

class BookingUserEntity extends Equatable {
  const BookingUserEntity({
    required this.id,
    required this.fullName,
    required this.mobileNumber,
    required this.email,
  });

  final String id;
  final String fullName;
  final String mobileNumber;
  final String email;

  @override
  List<Object?> get props => <Object?>[id, fullName, mobileNumber, email];
}

class OwnerBookingDetailsEntity extends Equatable {
  const OwnerBookingDetailsEntity({
    required this.id,
    required this.venueId,
    required this.venueName,
    required this.bookingDate,
    required this.status,
    required this.amount,
    required this.venueAmount,
    required this.cleaningFee,
    required this.commissionPercent,
    required this.commissionAmount,
    required this.securityAmount,
    required this.totalAmount,
    required this.lockExpiresAt,
    required this.createdAt,
    required this.slots,
    this.user,
  });

  final String id;
  final String venueId;
  final String venueName;
  final String bookingDate;
  final String status;
  final double amount;
  final double venueAmount;
  final double cleaningFee;
  final double commissionPercent;
  final double commissionAmount;
  final double securityAmount;
  final double totalAmount;
  final String lockExpiresAt;
  final String createdAt;
  final List<BookingSlotEntity> slots;
  final BookingUserEntity? user;

  @override
  List<Object?> get props => <Object?>[
        id,
        venueId,
        venueName,
        bookingDate,
        status,
        amount,
        venueAmount,
        cleaningFee,
        commissionPercent,
        commissionAmount,
        securityAmount,
        totalAmount,
        lockExpiresAt,
        createdAt,
        slots,
        user,
      ];
}
