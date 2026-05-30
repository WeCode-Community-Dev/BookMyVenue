import 'package:dio/dio.dart';

import '../../../../core/model/api_response.dart';
import '../../../../core/network/api_response_wrapper.dart';
import '../../../../core/network/base_remote_data_source.dart';
import '../../../../core/network/endpoints/auth_endpoints.dart';
import '../model/request_model/otp_request/otp_request.dart';
import '../model/request_model/verify_otp_request/verify_otp_request.dart';
import '../model/response_model/otp_response/otp_response.dart';
import '../model/response_model/verify_otp_response/verify_otp_response.dart';
import 'i_auth_remote_datasource.dart';

class AuthRemoteDatasourceImpl extends BaseRemoteDataSourceImpl
    implements IAuthRemoteDatasource {
  AuthRemoteDatasourceImpl(this.dio);
  final Dio dio;

  @override
  Future<ApiResponse<OtpResponse>> requestOtp(OtpRequest request) async {
    return safeApiCall(() async {
      final Response<dynamic> res = await dio.post(
        AuthEndpoints.requestOtp,
        data: request.toJson(),
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) => OtpResponse.fromJson(data! as Map<String, dynamic>),
      );
    });
  }

  @override
  Future<ApiResponse<VerifyOtpResponse>> verifyOtp(VerifyOtpRequest request) {
    return safeApiCall(() async {
      final Response<dynamic> res = await dio.post(
        AuthEndpoints.verifyOtp,
        data: request.toJson(),
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) =>
            VerifyOtpResponse.fromJson(data! as Map<String, dynamic>),
      );
    });
  }
}
