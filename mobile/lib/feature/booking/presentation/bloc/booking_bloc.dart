import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fpdart/fpdart.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../../core/errors/failures.dart';
import '../../data/model/booking_checkout_request.dart';
import '../../data/model/booking_verify_request.dart';
import '../../domain/entity/booking_entities.dart';
import '../../../../core/usecase/usecase.dart';
import '../../domain/usecase/booking_usecases.dart';

part 'booking_event.dart';
part 'booking_state.dart';
part 'booking_bloc.freezed.dart';

class BookingBloc extends Bloc<BookingEvent, BookingState> {
  BookingBloc({
    required CheckoutUseCase checkoutUseCase,
    required VerifyPaymentUseCase verifyPaymentUseCase,
    required CancelBookingUseCase cancelBookingUseCase,
    required GetMyBookingsUseCase getMyBookingsUseCase,
    required GetOwnerBookingsUseCase getOwnerBookingsUseCase,
  })  : _checkoutUseCase = checkoutUseCase,
        _verifyPaymentUseCase = verifyPaymentUseCase,
        _cancelBookingUseCase = cancelBookingUseCase,
        _getMyBookingsUseCase = getMyBookingsUseCase,
        _getOwnerBookingsUseCase = getOwnerBookingsUseCase,
        super(const BookingState.initial()) {
    on<_CheckoutEvent>(_onCheckout);
    on<_VerifyPaymentEvent>(_onVerifyPayment);
    on<_CancelEvent>(_onCancel);
    on<_FetchMyBookingsEvent>(_onFetchMyBookings);
    on<_FetchOwnerBookingsEvent>(_onFetchOwnerBookings);
  }

  final CheckoutUseCase _checkoutUseCase;
  final VerifyPaymentUseCase _verifyPaymentUseCase;
  final CancelBookingUseCase _cancelBookingUseCase;
  final GetMyBookingsUseCase _getMyBookingsUseCase;
  final GetOwnerBookingsUseCase _getOwnerBookingsUseCase;

  Future<void> _onCheckout(
    _CheckoutEvent event,
    Emitter<BookingState> emit,
  ) async {
    emit(const BookingState.loading());

    final Either<Failure, BookingCheckoutResult> result = await _checkoutUseCase(
      BookingCheckoutRequest(
        venueId: event.venueId,
        bookingDate: event.bookingDate,
        slotIds: event.slotIds,
      ),
    );

    result.fold(
      (Failure failure) => emit(BookingState.failure(message: failure.message)),
      (BookingCheckoutResult checkoutResult) => emit(
        BookingState.checkoutSuccess(result: checkoutResult),
      ),
    );
  }

  Future<void> _onVerifyPayment(
    _VerifyPaymentEvent event,
    Emitter<BookingState> emit,
  ) async {
    emit(const BookingState.loading());

    final Either<Failure, BookingDetailsEntity> result =
        await _verifyPaymentUseCase(
      BookingVerifyRequest(
        bookingId: event.bookingId,
        razorpayOrderId: event.razorpayOrderId,
        razorpayPaymentId: event.razorpayPaymentId,
        razorpaySignature: event.razorpaySignature,
      ),
    );

    result.fold(
      (Failure failure) => emit(BookingState.failure(message: failure.message)),
      (BookingDetailsEntity details) => emit(
        BookingState.verifySuccess(
          details: details,
          message: 'Payment verified successfully',
        ),
      ),
    );
  }

  Future<void> _onCancel(
    _CancelEvent event,
    Emitter<BookingState> emit,
  ) async {
    emit(const BookingState.loading());

    final Either<Failure, BookingDetailsEntity> result =
        await _cancelBookingUseCase(event.bookingId);

    result.fold(
      (Failure failure) => emit(BookingState.failure(message: failure.message)),
      (BookingDetailsEntity details) => emit(
        BookingState.cancelSuccess(
          details: details,
          message: 'Booking cancelled successfully',
        ),
      ),
    );
  }

  Future<void> _onFetchMyBookings(
    _FetchMyBookingsEvent event,
    Emitter<BookingState> emit,
  ) async {
    emit(const BookingState.loading());

    final Either<Failure, List<BookingDetailsEntity>> result =
        await _getMyBookingsUseCase(const NoParams());

    result.fold(
      (Failure failure) => emit(BookingState.failure(message: failure.message)),
      (List<BookingDetailsEntity> list) => emit(
        BookingState.myBookingsSuccess(bookings: list),
      ),
    );
  }

  Future<void> _onFetchOwnerBookings(
    _FetchOwnerBookingsEvent event,
    Emitter<BookingState> emit,
  ) async {
    emit(const BookingState.loading());

    final Either<Failure, List<OwnerBookingDetailsEntity>> result =
        await _getOwnerBookingsUseCase(const NoParams());

    result.fold(
      (Failure failure) => emit(BookingState.failure(message: failure.message)),
      (List<OwnerBookingDetailsEntity> list) => emit(
        BookingState.ownerBookingsSuccess(bookings: list),
      ),
    );
  }
}
