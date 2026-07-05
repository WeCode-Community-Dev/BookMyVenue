// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'owner_booking_verify_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OwnerBookingVerifyResponse _$OwnerBookingVerifyResponseFromJson(
  Map<String, dynamic> json,
) => _OwnerBookingVerifyResponse(
  id: json['id'] as String,
  venueId: json['venue_id'] as String,
  venueName: json['venue_name'] as String,
  bookingDate: json['booking_date'] as String,
  status: json['status'] as String,
  amount: (json['amount'] as num).toDouble(),
  venueAmount: (json['venue_amount'] as num).toDouble(),
  cleaningFee: (json['cleaning_fee'] as num).toDouble(),
  commissionPercent: (json['commission_percent'] as num).toDouble(),
  commissionAmount: (json['commission_amount'] as num).toDouble(),
  securityAmount: (json['security_amount'] as num).toDouble(),
  totalAmount: (json['total_amount'] as num).toDouble(),
  lockExpiresAt: json['lock_expires_at'] as String,
  createdAt: json['created_at'] as String,
  slots: (json['slots'] as List<dynamic>)
      .map((e) => BookingVerifySlotResponse.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$OwnerBookingVerifyResponseToJson(
  _OwnerBookingVerifyResponse instance,
) => <String, dynamic>{
  'id': instance.id,
  'venue_id': instance.venueId,
  'venue_name': instance.venueName,
  'booking_date': instance.bookingDate,
  'status': instance.status,
  'amount': instance.amount,
  'venue_amount': instance.venueAmount,
  'cleaning_fee': instance.cleaningFee,
  'commission_percent': instance.commissionPercent,
  'commission_amount': instance.commissionAmount,
  'security_amount': instance.securityAmount,
  'total_amount': instance.totalAmount,
  'lock_expires_at': instance.lockExpiresAt,
  'created_at': instance.createdAt,
  'slots': instance.slots,
};
