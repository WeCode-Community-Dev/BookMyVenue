import '../../domain/entity/user_entity.dart';
import '../model/user/response_model/otp_response/otp_response.dart';
import '../model/user/response_model/verify_otp_response/verify_otp_response.dart';

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

extension VerifyOtpResponseMapper on VerifyOtpResponse {
  VerifyOtpResponseEntity toEntity() {
    return VerifyOtpResponseEntity(
      accessToken: accessToken,
      refreshToken: refreshToken,
      tokenType: tokenType,
      user: user.toEntity(),
    );
  }
}

extension UserMapper on User {
  UserEntity toEntity() {
    return UserEntity(
      id: id,
      mobileNumber: mobileNumber,
      fullName: fullName,
      email: email,
      mobileVerified: mobileVerified,
      emailVerified: emailVerified,
      role: role,
      status: status,
      approvalStatus: approvalStatus,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }
}
