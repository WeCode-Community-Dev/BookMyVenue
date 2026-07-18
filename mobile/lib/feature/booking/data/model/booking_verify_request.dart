import 'package:freezed_annotation/freezed_annotation.dart';

part 'booking_verify_request.freezed.dart';
part 'booking_verify_request.g.dart';

@freezed
sealed class BookingVerifyRequest with _$BookingVerifyRequest {
  const factory BookingVerifyRequest({
    @JsonKey(name: 'booking_id') required String bookingId,
    @JsonKey(name: 'razorpay_order_id') required String razorpayOrderId,
    @JsonKey(name: 'razorpay_payment_id') required String razorpayPaymentId,
    @JsonKey(name: 'razorpay_signature') required String razorpaySignature,
  }) = _BookingVerifyRequest;

  factory BookingVerifyRequest.fromJson(Map<String, dynamic> json) =>
      _$BookingVerifyRequestFromJson(json);
}
