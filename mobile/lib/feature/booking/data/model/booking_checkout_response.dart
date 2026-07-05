import 'package:freezed_annotation/freezed_annotation.dart';

part 'booking_checkout_response.freezed.dart';
part 'booking_checkout_response.g.dart';

@freezed
sealed class BookingCheckoutResponse with _$BookingCheckoutResponse {
  const factory BookingCheckoutResponse({
    @JsonKey(name: 'booking_id') required String bookingId,
    required double amount,
    @JsonKey(name: 'razorpay_order_id') required String razorpayOrderId,
    @JsonKey(name: 'razorpay_key_id') required String razorpayKeyId,
    @JsonKey(name: 'lock_expires_at') required String lockExpiresAt,
  }) = _BookingCheckoutResponse;

  factory BookingCheckoutResponse.fromJson(Map<String, dynamic> json) =>
      _$BookingCheckoutResponseFromJson(json);
}
