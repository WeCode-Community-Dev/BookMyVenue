// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'register_request_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_RegisterRequestModel _$RegisterRequestModelFromJson(
  Map<String, dynamic> json,
) => _RegisterRequestModel(
  fullName: json['full_name'] as String,
  email: json['email'] as String,
  password: json['password'] as String,
  mobileNumber: json['mobile_number'] as String,
);

Map<String, dynamic> _$RegisterRequestModelToJson(
  _RegisterRequestModel instance,
) => <String, dynamic>{
  'full_name': instance.fullName,
  'email': instance.email,
  'password': instance.password,
  'mobile_number': instance.mobileNumber,
};
