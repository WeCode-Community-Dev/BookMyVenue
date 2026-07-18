import '../../../../core/model/api_response.dart';
import '../model/booking_checkout_request.dart';
import '../model/booking_checkout_response.dart';
import '../model/booking_verify_request.dart';
import '../model/booking_verify_response.dart';
import '../model/owner_booking_verify_response.dart';

abstract interface class IBookingRemoteDatasource {
  Future<ApiResponse<BookingCheckoutResponse>> checkout({
    required BookingCheckoutRequest request,
  });

  Future<ApiResponse<BookingVerifyResponse>> verifyPayment({
    required BookingVerifyRequest request,
  });

  Future<ApiResponse<BookingVerifyResponse>> cancelBooking({
    required String bookingId,
  });

  Future<ApiResponse<List<BookingVerifyResponse>>> getMyBookings();

  Future<ApiResponse<List<OwnerBookingVerifyResponse>>> getOwnerBookings();
}
