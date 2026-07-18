// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'auth_session_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AuthSessionModel _$AuthSessionModelFromJson(Map<String, dynamic> json) =>
    _AuthSessionModel(
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String,
      role: $enumDecode(_$UserRoleEnumMap, json['role']),
      userId: json['userId'] as String?,
      status: $enumDecodeNullable(_$ApprovalStatusEnumMap, json['status']),
      fullName: json['fullName'] as String?,
    );

Map<String, dynamic> _$AuthSessionModelToJson(_AuthSessionModel instance) =>
    <String, dynamic>{
      'accessToken': instance.accessToken,
      'refreshToken': instance.refreshToken,
      'role': _$UserRoleEnumMap[instance.role]!,
      'userId': instance.userId,
      'status': _$ApprovalStatusEnumMap[instance.status],
      'fullName': instance.fullName,
    };

const _$UserRoleEnumMap = {
  UserRole.customer: 'customer',
  UserRole.venueOwner: 'venue_owner',
  UserRole.admin: 'admin',
};

const _$ApprovalStatusEnumMap = {
  ApprovalStatus.pending: 'pending',
  ApprovalStatus.approved: 'approved',
  ApprovalStatus.rejected: 'rejected',
  ApprovalStatus.suspended: 'suspended',
};
