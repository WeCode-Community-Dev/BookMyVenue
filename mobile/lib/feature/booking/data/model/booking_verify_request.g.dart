// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'booking_verify_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_BookingVerifyRequest _$BookingVerifyRequestFromJson(
  Map<String, dynamic> json,
) => _BookingVerifyRequest(
  bookingId: json['booking_id'] as String,
  razorpayOrderId: json['razorpay_order_id'] as String,
  razorpayPaymentId: json['razorpay_payment_id'] as String,
  razorpaySignature: json['razorpay_signature'] as String,
);

Map<String, dynamic> _$BookingVerifyRequestToJson(
  _BookingVerifyRequest instance,
) => <String, dynamic>{
  'booking_id': instance.bookingId,
  'razorpay_order_id': instance.razorpayOrderId,
  'razorpay_payment_id': instance.razorpayPaymentId,
  'razorpay_signature': instance.razorpaySignature,
};
