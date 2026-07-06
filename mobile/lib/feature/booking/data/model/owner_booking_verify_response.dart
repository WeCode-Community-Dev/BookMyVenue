import 'package:freezed_annotation/freezed_annotation.dart';
import 'booking_verify_response.dart';

part 'owner_booking_verify_response.freezed.dart';
part 'owner_booking_verify_response.g.dart';

@freezed
sealed class OwnerBookingVerifyResponse with _$OwnerBookingVerifyResponse {
  const factory OwnerBookingVerifyResponse({
    required String id,
    @JsonKey(name: 'venue_id') required String venueId,
    @JsonKey(name: 'venue_name') required String venueName,
    @JsonKey(name: 'booking_date') required String bookingDate,
    required String status,
    required double amount,
    @JsonKey(name: 'venue_amount') required double venueAmount,
    @JsonKey(name: 'cleaning_fee') required double cleaningFee,
    @JsonKey(name: 'commission_percent') required double commissionPercent,
    @JsonKey(name: 'commission_amount') required double commissionAmount,
    @JsonKey(name: 'security_amount') required double securityAmount,
    @JsonKey(name: 'total_amount') required double totalAmount,
    @JsonKey(name: 'lock_expires_at') required String lockExpiresAt,
    @JsonKey(name: 'created_at') required String createdAt,
    required List<BookingVerifySlotResponse> slots,
    OwnerBookingUserResponse? user,
  }) = _OwnerBookingVerifyResponse;

  factory OwnerBookingVerifyResponse.fromJson(Map<String, dynamic> json) =>
      _$OwnerBookingVerifyResponseFromJson(json);
}

@freezed
sealed class OwnerBookingUserResponse with _$OwnerBookingUserResponse {
  const factory OwnerBookingUserResponse({
    required String id,
    @JsonKey(name: 'full_name') required String fullName,
    @JsonKey(name: 'mobile_number') required String mobileNumber,
    required String email,
  }) = _OwnerBookingUserResponse;

  factory OwnerBookingUserResponse.fromJson(Map<String, dynamic> json) =>
      _$OwnerBookingUserResponseFromJson(json);
}
