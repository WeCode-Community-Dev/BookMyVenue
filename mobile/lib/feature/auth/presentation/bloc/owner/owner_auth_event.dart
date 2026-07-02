part of 'owner_auth_bloc.dart';

@freezed
abstract class OwnerAuthEvent with _$OwnerAuthEvent {
  /// As a Owner
  const factory OwnerAuthEvent.registerAccount({
    required OwnerRegisterParams requestParam,
  }) = _RegisterAccountEvent;
  const factory OwnerAuthEvent.verifyOwnerOtp({
    required VerifyOwnerOtpParams requestParam,
  }) = _VerifyOwnerOtpEvent;
  const factory OwnerAuthEvent.getOwnerProfileStatus() = _GetOwnerProfileStatus;
}
