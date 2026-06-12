import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../../domain/enums/approval_status.dart';

part 'register_response_model.freezed.dart';
part 'register_response_model.g.dart';

@freezed
sealed class RegisterResponseModel with _$RegisterResponseModel {
  const factory RegisterResponseModel({
    @JsonKey(name: 'full_name') required String fullName,
    @JsonKey(name: 'business_name') required String businessName,
    required String email,
    @JsonKey(name: 'mobile_number') required String mobileNumber,
    required String otp,
    @JsonKey(name: 'expires_in_seconds') required int expiresInSeconds,
    required String message,
  }) = _RegisterResponseModel;

  factory RegisterResponseModel.fromJson(Map<String, dynamic> json) =>
      _$RegisterResponseModelFromJson(json);
}

@freezed
sealed class VerifyOwnerOtpResponseModel with _$VerifyOwnerOtpResponseModel {
  const factory VerifyOwnerOtpResponseModel({
    @JsonKey(name: 'access_token') required String accessToken,
    @JsonKey(name: 'refresh_token') required String refreshToken,
    @JsonKey(name: 'token_type') required String tokenType,
    required UserModel user,
  }) = _VerifyOwnerOtpResponseModel;

  factory VerifyOwnerOtpResponseModel.fromJson(Map<String, dynamic> json) =>
      _$VerifyOwnerOtpResponseModelFromJson(json);
}

@freezed
sealed class UserModel with _$UserModel {
  const factory UserModel({
    required String id,
    @JsonKey(name: 'mobile_number') required String mobileNumber,
    @JsonKey(name: 'full_name') required String fullName,
    required String email,
    @JsonKey(name: 'mobile_verified') required bool mobileVerified,
    @JsonKey(name: 'email_verified') required bool emailVerified,
    required String role,
    required String status,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
    @JsonKey(name: 'owner_profile')
    required OwnerBusinessProfileModel ownerProfile,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}

@freezed
sealed class OwnerBusinessProfileModel with _$OwnerBusinessProfileModel {
  const factory OwnerBusinessProfileModel({
    required String id,
    @JsonKey(name: 'user_id') required String userId,
    @JsonKey(name: 'business_name') required String businessName,
    @JsonKey(name: 'approval_status') required ApprovalStatus approvalStatus,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
  }) = _OwnerBusinessProfileModel;

  factory OwnerBusinessProfileModel.fromJson(Map<String, dynamic> json) =>
      _$OwnerBusinessProfileModelFromJson(json);
}
