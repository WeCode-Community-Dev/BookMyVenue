import '../../../../core/utils/type_def.dart';
import '../../data/model/booking_checkout_request.dart';
import '../../data/model/booking_verify_request.dart';
import '../entity/booking_entities.dart';

abstract interface class IBookingRepository {
  ResultFuture<BookingCheckoutResult> checkout({
    required BookingCheckoutRequest request,
  });

  ResultFuture<BookingDetailsEntity> verifyPayment({
    required BookingVerifyRequest request,
  });

  ResultFuture<BookingDetailsEntity> cancelBooking({
    required String bookingId,
  });

  ResultFuture<List<BookingDetailsEntity>> getMyBookings();

  ResultFuture<List<OwnerBookingDetailsEntity>> getOwnerBookings();
}
