import '../../../../core/model/api_response.dart';
import '../model/owner/reqeust_model/register_request_model.dart';
import '../model/owner/response_model/register_response_model.dart';
import '../model/user/request_model/otp_request/otp_request.dart';
import '../model/user/request_model/verify_otp_request/verify_otp_request.dart';
import '../model/user/response_model/otp_response/otp_response.dart';
import '../model/user/response_model/verify_otp_response/verify_otp_response.dart';

abstract interface class IAuthRemoteDatasource {
  Future<ApiResponse<OtpResponse>> requestOtp(OtpRequest request);
  Future<ApiResponse<VerifyOtpResponse>> verifyOtp(VerifyOtpRequest request);
}

abstract interface class IAuthOwnerDataSource {
  Future<ApiResponse<RegisterResponseModel>> registerAccount(
    OwnerRegisterRequest request,
  );
  Future<ApiResponse<VerifyOwnerOtpResponseModel>> verifyOwnerOtp(
    VerifyOwnerOtpRequest request,
  );
  Future<ApiResponse<VerifyOwnerOtpResponseModel>> getOwnerProfile();
}
