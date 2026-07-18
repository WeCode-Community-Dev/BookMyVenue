// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_user_profile_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_UpdateUserProfileRequest _$UpdateUserProfileRequestFromJson(
  Map<String, dynamic> json,
) => _UpdateUserProfileRequest(
  fullName: json['full_name'] as String,
  email: json['email'] as String,
);

Map<String, dynamic> _$UpdateUserProfileRequestToJson(
  _UpdateUserProfileRequest instance,
) => <String, dynamic>{'full_name': instance.fullName, 'email': instance.email};
