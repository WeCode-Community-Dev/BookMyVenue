// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'register_response_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_RegisterDataModel _$RegisterDataModelFromJson(Map<String, dynamic> json) =>
    _RegisterDataModel(
      fullName: json['full_name'] as String,
      email: json['email'] as String,
      mobileNumber: json['mobile_number'] as String,
      otp: json['otp'] as String,
      expiresInSeconds: (json['expires_in_seconds'] as num).toInt(),
      message: json['message'] as String,
    );

Map<String, dynamic> _$RegisterDataModelToJson(_RegisterDataModel instance) =>
    <String, dynamic>{
      'full_name': instance.fullName,
      'email': instance.email,
      'mobile_number': instance.mobileNumber,
      'otp': instance.otp,
      'expires_in_seconds': instance.expiresInSeconds,
      'message': instance.message,
    };
