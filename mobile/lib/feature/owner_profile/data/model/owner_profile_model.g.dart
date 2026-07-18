// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'owner_profile_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OwnerProfileModel _$OwnerProfileModelFromJson(Map<String, dynamic> json) =>
    _OwnerProfileModel(
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
      ownerProfile: json['owner_profile'] == null
          ? null
          : OwnerDetailModel.fromJson(
              json['owner_profile'] as Map<String, dynamic>,
            ),
    );

Map<String, dynamic> _$OwnerProfileModelToJson(_OwnerProfileModel instance) =>
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

_OwnerDetailModel _$OwnerDetailModelFromJson(Map<String, dynamic> json) =>
    _OwnerDetailModel(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      businessName: json['business_name'] as String,
      approvalStatus: json['approval_status'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );

Map<String, dynamic> _$OwnerDetailModelToJson(_OwnerDetailModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'user_id': instance.userId,
      'business_name': instance.businessName,
      'approval_status': instance.approvalStatus,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };
