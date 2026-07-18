import 'package:freezed_annotation/freezed_annotation.dart';

part 'booking_verify_response.freezed.dart';
part 'booking_verify_response.g.dart';

@freezed
sealed class BookingVerifyResponse with _$BookingVerifyResponse {
  const factory BookingVerifyResponse({
    required String id,
    @JsonKey(name: 'venue_id') required String venueId,
    @JsonKey(name: 'venue_name') required String venueName,
    @JsonKey(name: 'booking_date') required String bookingDate,
    required String status,
    required double amount,
    @JsonKey(name: 'lock_expires_at') required String lockExpiresAt,
    @JsonKey(name: 'created_at') required String createdAt,
    required List<BookingVerifySlotResponse> slots,
  }) = _BookingVerifyResponse;

  factory BookingVerifyResponse.fromJson(Map<String, dynamic> json) =>
      _$BookingVerifyResponseFromJson(json);
}

@freezed
sealed class BookingVerifySlotResponse with _$BookingVerifySlotResponse {
  const factory BookingVerifySlotResponse({
    required String id,
    @JsonKey(name: 'slot_name') required String slotName,
    @JsonKey(name: 'start_time') required String startTime,
    @JsonKey(name: 'end_time') required String endTime,
    required double price,
  }) = _BookingVerifySlotResponse;

  factory BookingVerifySlotResponse.fromJson(Map<String, dynamic> json) =>
      _$BookingVerifySlotResponseFromJson(json);
}
