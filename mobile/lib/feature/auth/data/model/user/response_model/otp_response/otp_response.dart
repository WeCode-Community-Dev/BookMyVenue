import 'package:freezed_annotation/freezed_annotation.dart';

part 'otp_response.freezed.dart';
part 'otp_response.g.dart';

@freezed
sealed class OtpResponse with _$OtpResponse {
  const factory OtpResponse({
    @JsonKey(name: 'mobile_number') required String mobileNumber,
    required String otp,
    @JsonKey(name: 'expires_in_seconds') required int expiresInSeconds,
    required String message,
  }) = _OtpResponse;

  factory OtpResponse.fromJson(Map<String, dynamic> json) =>
      _$OtpResponseFromJson(json);
}
