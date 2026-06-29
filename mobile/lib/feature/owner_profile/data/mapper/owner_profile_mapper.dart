import '../../domain/entity/owner_profile_entity.dart';
import '../model/owner_profile_model.dart';

extension OwnerProfileMapper on OwnerProfileModel {
  OwnerProfileResponseEntity toEntity() {
    return OwnerProfileResponseEntity(
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
      ownerProfile: ownerProfile?.toEntity(),
    );
  }
}

extension OwnerDetailMapper on OwnerDetailModel {
  OwnerProfileDetailEntity toEntity() {
    return OwnerProfileDetailEntity(
      id: id,
      userId: userId,
      businessName: businessName,
      approvalStatus: approvalStatus,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }
}
