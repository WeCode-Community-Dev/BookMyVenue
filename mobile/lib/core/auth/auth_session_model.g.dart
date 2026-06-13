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
      status: $enumDecodeNullable(_$ApprovalStatusEnumMap, json['status']),
    );

Map<String, dynamic> _$AuthSessionModelToJson(_AuthSessionModel instance) =>
    <String, dynamic>{
      'accessToken': instance.accessToken,
      'refreshToken': instance.refreshToken,
      'role': _$UserRoleEnumMap[instance.role]!,
      'status': _$ApprovalStatusEnumMap[instance.status],
    };

const _$UserRoleEnumMap = {
  UserRole.customer: 'customer',
  UserRole.venueOwner: 'venueOwner',
  UserRole.admin: 'admin',
};

const _$ApprovalStatusEnumMap = {
  ApprovalStatus.pending: 'pending',
  ApprovalStatus.approved: 'approved',
  ApprovalStatus.rejected: 'rejected',
  ApprovalStatus.suspended: 'suspended',
};
