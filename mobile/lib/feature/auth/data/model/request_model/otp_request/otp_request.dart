import 'package:freezed_annotation/freezed_annotation.dart';

part 'otp_request.freezed.dart';
part 'otp_request.g.dart';

@freezed
sealed class OtpRequest with _$OtpRequest {
  const factory OtpRequest({
    @JsonKey(name: 'mobile_number') required String mobileNumber,
  }) = _OtpRequest;

  factory OtpRequest.fromJson(Map<String, dynamic> json) =>
      _$OtpRequestFromJson(json);
}
