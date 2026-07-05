class BookingEndpoints {
  BookingEndpoints._();

  static const String _v1 = '/api/v1/bookings';

  static const String checkout = '$_v1/checkout';
  static const String verifyPayment = '$_v1/verify-payment';
  static const String myBookings = '$_v1/my-bookings';
  static const String ownerMyBookings = '$_v1/owner/my-bookings';

  static String cancel(String bookingId) => '$_v1/$bookingId/cancel';
}
