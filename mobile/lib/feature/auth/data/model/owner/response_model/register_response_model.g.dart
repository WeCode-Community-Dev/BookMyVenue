// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'register_response_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_RegisterResponseModel _$RegisterResponseModelFromJson(
  Map<String, dynamic> json,
) => _RegisterResponseModel(
  fullName: json['full_name'] as String,
  businessName: json['business_name'] as String,
  email: json['email'] as String,
  mobileNumber: json['mobile_number'] as String,
  otp: json['otp'] as String,
  expiresInSeconds: (json['expires_in_seconds'] as num).toInt(),
  message: json['message'] as String,
);

Map<String, dynamic> _$RegisterResponseModelToJson(
  _RegisterResponseModel instance,
) => <String, dynamic>{
  'full_name': instance.fullName,
  'business_name': instance.businessName,
  'email': instance.email,
  'mobile_number': instance.mobileNumber,
  'otp': instance.otp,
  'expires_in_seconds': instance.expiresInSeconds,
  'message': instance.message,
};

_VerifyOwnerOtpResponseModel _$VerifyOwnerOtpResponseModelFromJson(
  Map<String, dynamic> json,
) => _VerifyOwnerOtpResponseModel(
  accessToken: json['access_token'] as String,
  refreshToken: json['refresh_token'] as String,
  tokenType: json['token_type'] as String,
  user: UserModel.fromJson(json['user'] as Map<String, dynamic>),
);

Map<String, dynamic> _$VerifyOwnerOtpResponseModelToJson(
  _VerifyOwnerOtpResponseModel instance,
) => <String, dynamic>{
  'access_token': instance.accessToken,
  'refresh_token': instance.refreshToken,
  'token_type': instance.tokenType,
  'user': instance.user,
};

_UserModel _$UserModelFromJson(Map<String, dynamic> json) => _UserModel(
  id: json['id'] as String,
  mobileNumber: json['mobile_number'] as String,
  fullName: json['full_name'] as String,
  email: json['email'] as String,
  mobileVerified: json['mobile_verified'] as bool,
  emailVerified: json['email_verified'] as bool,
  role: json['role'] as String,
  status: json['status'] as String,
  createdAt: DateTime.parse(json['created_at'] as String),
  updatedAt: DateTime.parse(json['updated_at'] as String),
  ownerProfile: OwnerBusinessProfileModel.fromJson(
    json['owner_profile'] as Map<String, dynamic>,
  ),
);

Map<String, dynamic> _$UserModelToJson(_UserModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'mobile_number': instance.mobileNumber,
      'full_name': instance.fullName,
      'email': instance.email,
      'mobile_verified': instance.mobileVerified,
      'email_verified': instance.emailVerified,
      'role': instance.role,
      'status': instance.status,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
      'owner_profile': instance.ownerProfile,
    };

_OwnerBusinessProfileModel _$OwnerBusinessProfileModelFromJson(
  Map<String, dynamic> json,
) => _OwnerBusinessProfileModel(
  id: json['id'] as String,
  userId: json['user_id'] as String,
  businessName: json['business_name'] as String,
  approvalStatus: $enumDecode(_$ApprovalStatusEnumMap, json['approval_status']),
  createdAt: DateTime.parse(json['created_at'] as String),
  updatedAt: DateTime.parse(json['updated_at'] as String),
);

Map<String, dynamic> _$OwnerBusinessProfileModelToJson(
  _OwnerBusinessProfileModel instance,
) => <String, dynamic>{
  'id': instance.id,
  'user_id': instance.userId,
  'business_name': instance.businessName,
  'approval_status': _$ApprovalStatusEnumMap[instance.approvalStatus]!,
  'created_at': instance.createdAt.toIso8601String(),
  'updated_at': instance.updatedAt.toIso8601String(),
};

const _$ApprovalStatusEnumMap = {
  ApprovalStatus.pending: 'pending',
  ApprovalStatus.approved: 'approved',
  ApprovalStatus.rejected: 'rejected',
  ApprovalStatus.suspended: 'suspended',
};
