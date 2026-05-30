import '../../domain/entity/user_entity.dart';
import '../model/response_model/otp_response.dart';

extension OtpResponseMapper on OtpResponse {
  OtpResponseEntity toEntity() {
    return OtpResponseEntity(
      mobileNumber: mobileNumber,
      otp: otp,
      expiresInSeconds: expiresInSeconds,
      message: message,
    );
  }
}
