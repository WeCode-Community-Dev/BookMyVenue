import '../../domain/entity/owner_entity.dart';
import '../model/owner/response_model/register_response_model.dart';

extension RegisterDataMapper on RegisterResponseModel {
  RegisterDataEntity toEntity() {
    return RegisterDataEntity(
      fullName: fullName,
      email: email,
      mobileNumber: mobileNumber,
      otp: otp,
      expiresInSeconds: expiresInSeconds,
      message: message,
    );
  }
}

extension VerifyOtpDataMapper on VerifyOwnerOtpResponseModel {
  VerifyOtpDataEntity toEntity() {
    return VerifyOtpDataEntity(
      accessToken: accessToken,
      refreshToken: refreshToken,
      tokenType: tokenType,
      user: user.toEntity(),
    );
  }
}

extension UserMapper on UserModel {
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
      createdAt: createdAt,
      updatedAt: updatedAt,
      ownerBusinessProfileEntity: ownerProfile.toEntity(),
    );
  }
}

extension OwnerBusinessProfileModelMapper on OwnerBusinessProfileModel {
  OwnerBusinessProfileEntity toEntity() {
    return OwnerBusinessProfileEntity(
      id: id,
      userId: userId,
      businessName: businessName,
      approvalStatus: approvalStatus,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }
}
