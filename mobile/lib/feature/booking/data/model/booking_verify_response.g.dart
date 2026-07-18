// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'booking_verify_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_BookingVerifyResponse _$BookingVerifyResponseFromJson(
  Map<String, dynamic> json,
) => _BookingVerifyResponse(
  id: json['id'] as String,
  venueId: json['venue_id'] as String,
  venueName: json['venue_name'] as String,
  bookingDate: json['booking_date'] as String,
  status: json['status'] as String,
  amount: (json['amount'] as num).toDouble(),
  lockExpiresAt: json['lock_expires_at'] as String,
  createdAt: json['created_at'] as String,
  slots: (json['slots'] as List<dynamic>)
      .map((e) => BookingVerifySlotResponse.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$BookingVerifyResponseToJson(
  _BookingVerifyResponse instance,
) => <String, dynamic>{
  'id': instance.id,
  'venue_id': instance.venueId,
  'venue_name': instance.venueName,
  'booking_date': instance.bookingDate,
  'status': instance.status,
  'amount': instance.amount,
  'lock_expires_at': instance.lockExpiresAt,
  'created_at': instance.createdAt,
  'slots': instance.slots,
};

_BookingVerifySlotResponse _$BookingVerifySlotResponseFromJson(
  Map<String, dynamic> json,
) => _BookingVerifySlotResponse(
  id: json['id'] as String,
  slotName: json['slot_name'] as String,
  startTime: json['start_time'] as String,
  endTime: json['end_time'] as String,
  price: (json['price'] as num).toDouble(),
);

Map<String, dynamic> _$BookingVerifySlotResponseToJson(
  _BookingVerifySlotResponse instance,
) => <String, dynamic>{
  'id': instance.id,
  'slot_name': instance.slotName,
  'start_time': instance.startTime,
  'end_time': instance.endTime,
  'price': instance.price,
};
