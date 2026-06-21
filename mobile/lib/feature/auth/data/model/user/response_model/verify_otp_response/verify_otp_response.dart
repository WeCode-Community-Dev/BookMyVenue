import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../../../domain/enums/role_base.dart';

part 'verify_otp_response.freezed.dart';
part 'verify_otp_response.g.dart';

@freezed
sealed class VerifyOtpResponse with _$VerifyOtpResponse {
  const factory VerifyOtpResponse({
    @JsonKey(name: 'access_token') required String accessToken,
    @JsonKey(name: 'refresh_token') required String refreshToken,
    @JsonKey(name: 'token_type') required String tokenType,
    required User user,
  }) = _VerifyOtpResponse;

  factory VerifyOtpResponse.fromJson(Map<String, dynamic> json) =>
      _$VerifyOtpResponseFromJson(json);
}

@freezed
sealed class User with _$User {
  const factory User({
    required String id,
    @JsonKey(name: 'mobile_number') required String mobileNumber,
    @JsonKey(name: 'full_name') String? fullName,
    required String? email,
    @JsonKey(name: 'mobile_verified') required bool mobileVerified,
    @JsonKey(name: 'email_verified') required bool emailVerified,
    required UserRole role,
    required String status,
    @JsonKey(name: 'created_at') required DateTime createdAt,
    @JsonKey(name: 'updated_at') required DateTime updatedAt,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}
