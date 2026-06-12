part of 'auth_bloc.dart';

@freezed
abstract class AuthEvent with _$AuthEvent {
  /// As a user
  const factory AuthEvent.requestOtp({required OtpRequestParams requestParam}) =
      _RequestOtpEvent;
  const factory AuthEvent.verifyOtp({
    required VerifyOtpRequestParams requestParam,
  }) = _VerifyOtpEvent;

  /// As a owner
  const factory AuthEvent.createAccount({
    required OtpRequestParams requestParam,
  }) = _CreateAccountEvent;
  const factory AuthEvent.verifyOwnerOtp({
    required VerifyOtpRequestParams requestParam,
  }) = _VerifyOwnerOtpEvent;
  const factory AuthEvent.createBusinessProfile({
    required OtpRequestParams requestParam,
  }) = _CreateBusinessProfileEvent;
}
