// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'otp_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OtpResponse _$OtpResponseFromJson(Map<String, dynamic> json) => _OtpResponse(
  mobileNumber: json['mobile_number'] as String,
  otp: json['otp'] as String,
  expiresInSeconds: (json['expires_in_seconds'] as num).toInt(),
  message: json['message'] as String,
);

Map<String, dynamic> _$OtpResponseToJson(_OtpResponse instance) =>
    <String, dynamic>{
      'mobile_number': instance.mobileNumber,
      'otp': instance.otp,
      'expires_in_seconds': instance.expiresInSeconds,
      'message': instance.message,
    };
