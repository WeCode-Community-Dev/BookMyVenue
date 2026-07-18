import 'package:dio/dio.dart';

import '../../../../core/model/api_response.dart';
import '../../../../core/network/api_response_wrapper.dart';
import '../../../../core/network/base_remote_data_source.dart';
import '../../../../core/network/endpoints/booking_endpoints.dart';
import '../model/booking_checkout_request.dart';
import '../model/booking_checkout_response.dart';
import '../model/booking_verify_request.dart';
import '../model/booking_verify_response.dart';
import '../model/owner_booking_verify_response.dart';
import 'i_booking_remote_datasource.dart';

class BookingRemoteDatasourceImpl extends BaseRemoteDataSourceImpl
    implements IBookingRemoteDatasource {
  BookingRemoteDatasourceImpl(this._dio);

  final Dio _dio;

  @override
  Future<ApiResponse<BookingCheckoutResponse>> checkout({
    required BookingCheckoutRequest request,
  }) {
    return safeApiCall(() async {
      final Response<dynamic> res = await _dio.post(
        BookingEndpoints.checkout,
        data: request.toJson(),
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) =>
            BookingCheckoutResponse.fromJson(data! as Map<String, dynamic>),
      );
    });
  }

  @override
  Future<ApiResponse<BookingVerifyResponse>> verifyPayment({
    required BookingVerifyRequest request,
  }) {
    return safeApiCall(() async {
      final Response<dynamic> res = await _dio.post(
        BookingEndpoints.verifyPayment,
        data: request.toJson(),
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) =>
            BookingVerifyResponse.fromJson(data! as Map<String, dynamic>),
      );
    });
  }

  @override
  Future<ApiResponse<BookingVerifyResponse>> cancelBooking({
    required String bookingId,
  }) {
    return safeApiCall(() async {
      final Response<dynamic> res = await _dio.post(
        BookingEndpoints.cancel(bookingId),
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) =>
            BookingVerifyResponse.fromJson(data! as Map<String, dynamic>),
      );
    });
  }

  @override
  Future<ApiResponse<List<BookingVerifyResponse>>> getMyBookings() {
    return safeApiCall(() async {
      final Response<dynamic> res = await _dio.get(
        BookingEndpoints.myBookings,
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) => (data! as List<dynamic>)
            .map((dynamic item) =>
                BookingVerifyResponse.fromJson(item as Map<String, dynamic>))
            .toList(),
      );
    });
  }

  @override
  Future<ApiResponse<List<OwnerBookingVerifyResponse>>> getOwnerBookings() {
    return safeApiCall(() async {
      final Response<dynamic> res = await _dio.get(
        BookingEndpoints.ownerMyBookings,
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) => (data! as List<dynamic>)
            .map((dynamic item) =>
                OwnerBookingVerifyResponse.fromJson(item as Map<String, dynamic>))
            .toList(),
      );
    });
  }
}
