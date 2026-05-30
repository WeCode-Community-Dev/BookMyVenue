// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'verify_otp_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_VerifyOtpRequest _$VerifyOtpRequestFromJson(Map<String, dynamic> json) =>
    _VerifyOtpRequest(
      mobileNumber: json['mobile_number'] as String,
      otp: json['otp'] as String,
    );

Map<String, dynamic> _$VerifyOtpRequestToJson(_VerifyOtpRequest instance) =>
    <String, dynamic>{
      'mobile_number': instance.mobileNumber,
      'otp': instance.otp,
    };
