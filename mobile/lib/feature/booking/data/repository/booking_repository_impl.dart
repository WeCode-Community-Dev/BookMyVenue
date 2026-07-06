import '../../../../core/model/api_response.dart';
import '../../../../core/network/base_repository.dart';
import '../../../../core/utils/type_def.dart';
import '../../domain/entity/booking_entities.dart';
import '../../domain/repository/i_booking_repository.dart';
import '../datasource/i_booking_remote_datasource.dart';
import '../model/booking_checkout_request.dart';
import '../model/booking_checkout_response.dart';
import '../model/booking_verify_request.dart';
import '../model/booking_verify_response.dart';
import '../model/owner_booking_verify_response.dart';

class BookingRepositoryImpl extends BaseRepository
    implements IBookingRepository {
  BookingRepositoryImpl({required this.remoteDatasource});

  final IBookingRemoteDatasource remoteDatasource;

  @override
  ResultFuture<BookingCheckoutResult> checkout({
    required BookingCheckoutRequest request,
  }) {
    return handleRequest(() async {
      final ApiResponse<BookingCheckoutResponse> response =
          await remoteDatasource.checkout(request: request);
      final BookingCheckoutResponse data = response.data!;
      return BookingCheckoutResult(
        bookingId: data.bookingId,
        amount: data.amount,
        razorpayOrderId: data.razorpayOrderId,
        razorpayKeyId: data.razorpayKeyId,
        lockExpiresAt: data.lockExpiresAt,
      );
    });
  }

  @override
  ResultFuture<BookingDetailsEntity> verifyPayment({
    required BookingVerifyRequest request,
  }) {
    return handleRequest(() async {
      final ApiResponse<BookingVerifyResponse> response =
          await remoteDatasource.verifyPayment(request: request);
      final BookingVerifyResponse data = response.data!;
      return BookingDetailsEntity(
        id: data.id,
        venueId: data.venueId,
        venueName: data.venueName,
        bookingDate: data.bookingDate,
        status: data.status,
        amount: data.amount,
        lockExpiresAt: data.lockExpiresAt,
        createdAt: data.createdAt,
        slots: data.slots
            .map(
              (BookingVerifySlotResponse s) => BookingSlotEntity(
                id: s.id,
                slotName: s.slotName,
                startTime: s.startTime,
                endTime: s.endTime,
                price: s.price,
              ),
            )
            .toList(),
      );
    });
  }

  @override
  ResultFuture<BookingDetailsEntity> cancelBooking({
    required String bookingId,
  }) {
    return handleRequest(() async {
      final ApiResponse<BookingVerifyResponse> response =
          await remoteDatasource.cancelBooking(bookingId: bookingId);
      final BookingVerifyResponse data = response.data!;
      return BookingDetailsEntity(
        id: data.id,
        venueId: data.venueId,
        venueName: data.venueName,
        bookingDate: data.bookingDate,
        status: data.status,
        amount: data.amount,
        lockExpiresAt: data.lockExpiresAt,
        createdAt: data.createdAt,
        slots: data.slots
            .map(
              (BookingVerifySlotResponse s) => BookingSlotEntity(
                id: s.id,
                slotName: s.slotName,
                startTime: s.startTime,
                endTime: s.endTime,
                price: s.price,
              ),
            )
            .toList(),
      );
    });
  }

  @override
  ResultFuture<List<BookingDetailsEntity>> getMyBookings() {
    return handleRequest(() async {
      final ApiResponse<List<BookingVerifyResponse>> response =
          await remoteDatasource.getMyBookings();
      final List<BookingVerifyResponse> dataList = response.data!;
      return dataList
          .map(
            (BookingVerifyResponse d) => BookingDetailsEntity(
              id: d.id,
              venueId: d.venueId,
              venueName: d.venueName,
              bookingDate: d.bookingDate,
              status: d.status,
              amount: d.amount,
              lockExpiresAt: d.lockExpiresAt,
              createdAt: d.createdAt,
              slots: d.slots
                  .map(
                    (BookingVerifySlotResponse s) => BookingSlotEntity(
                      id: s.id,
                      slotName: s.slotName,
                      startTime: s.startTime,
                      endTime: s.endTime,
                      price: s.price,
                    ),
                  )
                  .toList(),
            ),
          )
          .toList();
    });
  }

  @override
  ResultFuture<List<OwnerBookingDetailsEntity>> getOwnerBookings() {
    return handleRequest(() async {
      final ApiResponse<List<OwnerBookingVerifyResponse>> response =
          await remoteDatasource.getOwnerBookings();
      final List<OwnerBookingVerifyResponse> dataList = response.data!;
      return dataList
          .map(
            (OwnerBookingVerifyResponse d) => OwnerBookingDetailsEntity(
              id: d.id,
              venueId: d.venueId,
              venueName: d.venueName,
              bookingDate: d.bookingDate,
              status: d.status,
              amount: d.amount,
              venueAmount: d.venueAmount,
              cleaningFee: d.cleaningFee,
              commissionPercent: d.commissionPercent,
              commissionAmount: d.commissionAmount,
              securityAmount: d.securityAmount,
              totalAmount: d.totalAmount,
              lockExpiresAt: d.lockExpiresAt,
              createdAt: d.createdAt,
              slots: d.slots
                  .map(
                    (BookingVerifySlotResponse s) => BookingSlotEntity(
                      id: s.id,
                      slotName: s.slotName,
                      startTime: s.startTime,
                      endTime: s.endTime,
                      price: s.price,
                    ),
                  )
                  .toList(),
              user: d.user != null
                  ? BookingUserEntity(
                      id: d.user!.id,
                      fullName: d.user!.fullName,
                      mobileNumber: d.user!.mobileNumber,
                      email: d.user!.email,
                    )
                  : null,
            ),
          )
          .toList();
    });
  }
}
