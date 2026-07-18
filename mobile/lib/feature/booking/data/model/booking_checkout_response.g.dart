// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'booking_checkout_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_BookingCheckoutResponse _$BookingCheckoutResponseFromJson(
  Map<String, dynamic> json,
) => _BookingCheckoutResponse(
  bookingId: json['booking_id'] as String,
  amount: (json['amount'] as num).toDouble(),
  razorpayOrderId: json['razorpay_order_id'] as String,
  razorpayKeyId: json['razorpay_key_id'] as String,
  lockExpiresAt: json['lock_expires_at'] as String,
);

Map<String, dynamic> _$BookingCheckoutResponseToJson(
  _BookingCheckoutResponse instance,
) => <String, dynamic>{
  'booking_id': instance.bookingId,
  'amount': instance.amount,
  'razorpay_order_id': instance.razorpayOrderId,
  'razorpay_key_id': instance.razorpayKeyId,
  'lock_expires_at': instance.lockExpiresAt,
};
