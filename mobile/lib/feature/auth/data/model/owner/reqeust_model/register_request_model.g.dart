// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'register_request_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_OwnerRegisterRequest _$OwnerRegisterRequestFromJson(
  Map<String, dynamic> json,
) => _OwnerRegisterRequest(
  fullName: json['full_name'] as String,
  businessName: json['business_name'] as String,
  email: json['email'] as String,
  mobileNumber: json['mobile_number'] as String,
  password: json['password'] as String,
);

Map<String, dynamic> _$OwnerRegisterRequestToJson(
  _OwnerRegisterRequest instance,
) => <String, dynamic>{
  'full_name': instance.fullName,
  'business_name': instance.businessName,
  'email': instance.email,
  'mobile_number': instance.mobileNumber,
  'password': instance.password,
};

_VerifyOwnerOtpRequest _$VerifyOwnerOtpRequestFromJson(
  Map<String, dynamic> json,
) => _VerifyOwnerOtpRequest(
  mobileNumber: json['mobile_number'] as String,
  otp: json['otp'] as String,
);

Map<String, dynamic> _$VerifyOwnerOtpRequestToJson(
  _VerifyOwnerOtpRequest instance,
) => <String, dynamic>{
  'mobile_number': instance.mobileNumber,
  'otp': instance.otp,
};
