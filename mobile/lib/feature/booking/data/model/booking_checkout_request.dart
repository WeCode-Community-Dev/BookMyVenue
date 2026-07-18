import 'package:freezed_annotation/freezed_annotation.dart';

part 'booking_checkout_request.freezed.dart';
part 'booking_checkout_request.g.dart';

@freezed
sealed class BookingCheckoutRequest with _$BookingCheckoutRequest {
  const factory BookingCheckoutRequest({
    @JsonKey(name: 'venue_id') required String venueId,
    @JsonKey(name: 'booking_date') required String bookingDate,
    @JsonKey(name: 'slot_ids') required List<String> slotIds,
  }) = _BookingCheckoutRequest;

  factory BookingCheckoutRequest.fromJson(Map<String, dynamic> json) =>
      _$BookingCheckoutRequestFromJson(json);
}
