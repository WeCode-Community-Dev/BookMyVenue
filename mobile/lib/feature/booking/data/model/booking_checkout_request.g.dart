// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'booking_checkout_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_BookingCheckoutRequest _$BookingCheckoutRequestFromJson(
  Map<String, dynamic> json,
) => _BookingCheckoutRequest(
  venueId: json['venue_id'] as String,
  bookingDate: json['booking_date'] as String,
  slotIds: (json['slot_ids'] as List<dynamic>).map((e) => e as String).toList(),
);

Map<String, dynamic> _$BookingCheckoutRequestToJson(
  _BookingCheckoutRequest instance,
) => <String, dynamic>{
  'venue_id': instance.venueId,
  'booking_date': instance.bookingDate,
  'slot_ids': instance.slotIds,
};
