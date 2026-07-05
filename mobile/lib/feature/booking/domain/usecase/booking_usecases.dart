import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../../data/model/booking_checkout_request.dart';
import '../../data/model/booking_verify_request.dart';
import '../entity/booking_entities.dart';
import '../repository/i_booking_repository.dart';

class CheckoutUseCase
    extends UseCase<ResultFuture<BookingCheckoutResult>, BookingCheckoutRequest> {
  CheckoutUseCase({required this.repository});

  final IBookingRepository repository;

  @override
  ResultFuture<BookingCheckoutResult> call(BookingCheckoutRequest params) async {
    return repository.checkout(request: params);
  }
}

class VerifyPaymentUseCase
    extends UseCase<ResultFuture<BookingDetailsEntity>, BookingVerifyRequest> {
  VerifyPaymentUseCase({required this.repository});

  final IBookingRepository repository;

  @override
  ResultFuture<BookingDetailsEntity> call(BookingVerifyRequest params) async {
    return repository.verifyPayment(request: params);
  }
}

class CancelBookingUseCase
    extends UseCase<ResultFuture<BookingDetailsEntity>, String> {
  CancelBookingUseCase({required this.repository});

  final IBookingRepository repository;

  @override
  ResultFuture<BookingDetailsEntity> call(String params) async {
    return repository.cancelBooking(bookingId: params);
  }
}

class GetMyBookingsUseCase
    extends UseCase<ResultFuture<List<BookingDetailsEntity>>, NoParams> {
  GetMyBookingsUseCase({required this.repository});

  final IBookingRepository repository;

  @override
  ResultFuture<List<BookingDetailsEntity>> call(NoParams params) async {
    return repository.getMyBookings();
  }
}

class GetOwnerBookingsUseCase
    extends UseCase<ResultFuture<List<OwnerBookingDetailsEntity>>, NoParams> {
  GetOwnerBookingsUseCase({required this.repository});

  final IBookingRepository repository;

  @override
  ResultFuture<List<OwnerBookingDetailsEntity>> call(NoParams params) async {
    return repository.getOwnerBookings();
  }
}
