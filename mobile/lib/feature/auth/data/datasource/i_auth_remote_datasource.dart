import '../../../../core/model/api_response.dart';
import '../model/user/request_model/otp_request/otp_request.dart';
import '../model/user/request_model/verify_otp_request/verify_otp_request.dart';
import '../model/user/response_model/otp_response/otp_response.dart';
import '../model/user/response_model/verify_otp_response/verify_otp_response.dart';

abstract interface class IAuthRemoteDatasource {
  Future<ApiResponse<OtpResponse>> requestOtp(OtpRequest request);
  Future<ApiResponse<VerifyOtpResponse>> verifyOtp(VerifyOtpRequest request);
}

abstract interface class IAuthOwnerDataSource {
  Future<ApiResponse<OtpResponse>> createAccount(OtpRequest request);
  Future<ApiResponse<VerifyOtpResponse>> verifyOwnerOtp(
    VerifyOtpRequest request,
  );
  Future<ApiResponse<VerifyOtpResponse>> createBusinessProfile(
    VerifyOtpRequest request,
  );
}
