import 'package:dio/dio.dart';

import '../../../../core/model/api_response.dart';
import '../../../../core/network/api_response_wrapper.dart';
import '../../../../core/network/base_remote_data_source.dart';
import '../../../../core/network/endpoints/auth_endpoints.dart';
import '../model/owner/reqeust_model/register_request_model.dart';
import '../model/owner/response_model/register_response_model.dart';
import '../model/user/request_model/otp_request/otp_request.dart';
import '../model/user/request_model/verify_otp_request/verify_otp_request.dart';
import '../model/user/response_model/otp_response/otp_response.dart';
import '../model/user/response_model/verify_otp_response/verify_otp_response.dart';
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

class AuthOwnerRemoteDataSourceImpl extends BaseRemoteDataSourceImpl
    implements IAuthOwnerDataSource {
  AuthOwnerRemoteDataSourceImpl(this.dio);

  final Dio dio;

  @override
  Future<ApiResponse<RegisterResponseModel>> registerAccount(
    OwnerRegisterRequest request,
  ) async {
    return safeApiCall(() async {
      final Response<dynamic> res = await dio.post(
        AuthOwnerEndpoints.requestOtp,
        data: request.toJson(),
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) =>
            RegisterResponseModel.fromJson(data! as Map<String, dynamic>),
      );
    });
  }

  @override
  Future<ApiResponse<VerifyOwnerOtpResponseModel>> verifyOwnerOtp(
    VerifyOwnerOtpRequest request,
  ) async {
    return safeApiCall(() async {
      final Response<dynamic> res = await dio.post(
        AuthOwnerEndpoints.verifyOtp,
        data: request.toJson(),
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) =>
            VerifyOwnerOtpResponseModel.fromJson(data! as Map<String, dynamic>),
      );
    });
  }

  @override
  Future<ApiResponse<VerifyOwnerOtpResponseModel>> getOwnerProfile() {
    return safeApiCall(() async {
      final Response<dynamic> res = await dio.get(
        AuthOwnerEndpoints.ownerProfile,
      );

      return ApiResponseMapper.fromJson(
        res.data as Map<String, dynamic>,
        (Object? data) =>
            VerifyOwnerOtpResponseModel.fromJson(data! as Map<String, dynamic>),
      );
    });
  }
}
