part of 'booking_bloc.dart';

@freezed
class BookingEvent with _$BookingEvent {
  const factory BookingEvent.checkout({
    required String venueId,
    required String bookingDate,
    required List<String> slotIds,
  }) = _CheckoutEvent;

  const factory BookingEvent.verifyPayment({
    required String bookingId,
    required String razorpayOrderId,
    required String razorpayPaymentId,
    required String razorpaySignature,
  }) = _VerifyPaymentEvent;

  const factory BookingEvent.cancel({
    required String bookingId,
  }) = _CancelEvent;

  const factory BookingEvent.fetchMyBookings() = _FetchMyBookingsEvent;

  const factory BookingEvent.fetchOwnerBookings() = _FetchOwnerBookingsEvent;
}
