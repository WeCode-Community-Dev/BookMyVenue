import '../../domain/entity/user_profile_entity.dart';
import '../model/user_profile_model.dart';

extension UserProfileMapper on UserProfileModel {
  UserProfileResponseEntity toEntity() {
    return UserProfileResponseEntity(
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
    );
  }
}
