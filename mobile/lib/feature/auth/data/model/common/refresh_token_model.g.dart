// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'refresh_token_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_RefreshTokenRequestModel _$RefreshTokenRequestModelFromJson(
  Map<String, dynamic> json,
) => _RefreshTokenRequestModel(refreshToken: json['refresh_token'] as String);

Map<String, dynamic> _$RefreshTokenRequestModelToJson(
  _RefreshTokenRequestModel instance,
) => <String, dynamic>{'refresh_token': instance.refreshToken};

_RefreshTokenResponseModel _$RefreshTokenResponseModelFromJson(
  Map<String, dynamic> json,
) => _RefreshTokenResponseModel(
  accessToken: json['access_token'] as String,
  refreshToken: json['refresh_token'] as String,
  tokenType: json['token_type'] as String,
);

Map<String, dynamic> _$RefreshTokenResponseModelToJson(
  _RefreshTokenResponseModel instance,
) => <String, dynamic>{
  'access_token': instance.accessToken,
  'refresh_token': instance.refreshToken,
  'token_type': instance.tokenType,
};
