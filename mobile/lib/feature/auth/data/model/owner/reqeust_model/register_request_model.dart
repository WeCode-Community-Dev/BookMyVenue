import 'package:freezed_annotation/freezed_annotation.dart';

part 'register_request_model.freezed.dart';
part 'register_request_model.g.dart';

@freezed
sealed class OwnerRegisterRequest with _$OwnerRegisterRequest {
  const factory OwnerRegisterRequest({
    @JsonKey(name: 'full_name') required String fullName,
    @JsonKey(name: 'business_name') required String businessName,
    required String email,
    @JsonKey(name: 'mobile_number') required String mobileNumber,
    required String password,
  }) = _OwnerRegisterRequest;

  factory OwnerRegisterRequest.fromJson(Map<String, dynamic> json) =>
      _$OwnerRegisterRequestFromJson(json);
}

@freezed
sealed class VerifyOwnerOtpRequest with _$VerifyOwnerOtpRequest {
  const factory VerifyOwnerOtpRequest({
    @JsonKey(name: 'mobile_number') required String mobileNumber,
    required String otp,
  }) = _VerifyOwnerOtpRequest;

  factory VerifyOwnerOtpRequest.fromJson(Map<String, dynamic> json) =>
      _$VerifyOwnerOtpRequestFromJson(json);
}
