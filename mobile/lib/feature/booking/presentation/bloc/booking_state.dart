part of 'booking_bloc.dart';

@freezed
class BookingState with _$BookingState {
  const factory BookingState.initial() = _Initial;
  const factory BookingState.loading() = _Loading;

  const factory BookingState.checkoutSuccess({
    required BookingCheckoutResult result,
  }) = _CheckoutSuccess;

  const factory BookingState.verifySuccess({
    required BookingDetailsEntity details,
    required String message,
  }) = _VerifySuccess;

  const factory BookingState.cancelSuccess({
    required BookingDetailsEntity details,
    required String message,
  }) = _CancelSuccess;

  const factory BookingState.myBookingsSuccess({
    required List<BookingDetailsEntity> bookings,
  }) = _MyBookingsSuccess;

  const factory BookingState.ownerBookingsSuccess({
    required List<OwnerBookingDetailsEntity> bookings,
  }) = _OwnerBookingsSuccess;

  const factory BookingState.failure({
    required String message,
  }) = _Failure;
}
