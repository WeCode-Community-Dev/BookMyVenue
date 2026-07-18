import 'package:freezed_annotation/freezed_annotation.dart';

part 'verify_otp_request.freezed.dart';
part 'verify_otp_request.g.dart';

@freezed
sealed class VerifyOtpRequest with _$VerifyOtpRequest {
  const factory VerifyOtpRequest({
    @JsonKey(name: 'mobile_number') required String mobileNumber,
    required String otp,
  }) = _VerifyOtpRequest;

  factory VerifyOtpRequest.fromJson(Map<String, dynamic> json) =>
      _$VerifyOtpRequestFromJson(json);
}
