part of 'auth_bloc.dart';

@freezed
abstract class AuthEvent with _$AuthEvent {
  const factory AuthEvent.requestOtp({required OtpRequestParams requestParam}) =
      _RequestOtpEvent;
  const factory AuthEvent.verifyOtp({
    required VerifyOtpRequestParams requestParam,
  }) = _VerifyOtpEvent;
}
