import '../../../../core/model/api_response.dart';
import '../model/request_model/otp_request.dart';
import '../model/response_model/otp_response.dart';

abstract interface class IAuthRemoteDatasource {
  Future<ApiResponse<OtpResponse>> requestOtp(OtpRequest request);

  // Future<ApiResponse<AuthResponseModel>> signUp(SignUpRequest request);
}
