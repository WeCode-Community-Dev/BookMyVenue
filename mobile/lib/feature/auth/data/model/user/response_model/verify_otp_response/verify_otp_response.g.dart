// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'verify_otp_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_VerifyOtpResponse _$VerifyOtpResponseFromJson(Map<String, dynamic> json) =>
    _VerifyOtpResponse(
      accessToken: json['access_token'] as String,
      refreshToken: json['refresh_token'] as String,
      tokenType: json['token_type'] as String,
      user: User.fromJson(json['user'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$VerifyOtpResponseToJson(_VerifyOtpResponse instance) =>
    <String, dynamic>{
      'access_token': instance.accessToken,
      'refresh_token': instance.refreshToken,
      'token_type': instance.tokenType,
      'user': instance.user,
    };

_User _$UserFromJson(Map<String, dynamic> json) => _User(
  id: json['id'] as String,
  mobileNumber: json['mobile_number'] as String,
  fullName: json['full_name'] as String?,
  email: json['email'] as String?,
  mobileVerified: json['mobile_verified'] as bool,
  emailVerified: json['email_verified'] as bool,
  role: $enumDecode(_$UserRoleEnumMap, json['role']),
  status: json['status'] as String,
  createdAt: DateTime.parse(json['created_at'] as String),
  updatedAt: DateTime.parse(json['updated_at'] as String),
);

Map<String, dynamic> _$UserToJson(_User instance) => <String, dynamic>{
  'id': instance.id,
  'mobile_number': instance.mobileNumber,
  'full_name': instance.fullName,
  'email': instance.email,
  'mobile_verified': instance.mobileVerified,
  'email_verified': instance.emailVerified,
  'role': _$UserRoleEnumMap[instance.role]!,
  'status': instance.status,
  'created_at': instance.createdAt.toIso8601String(),
  'updated_at': instance.updatedAt.toIso8601String(),
};

const _$UserRoleEnumMap = {
  UserRole.customer: 'customer',
  UserRole.venueOwner: 'venue_owner',
  UserRole.admin: 'admin',
};
