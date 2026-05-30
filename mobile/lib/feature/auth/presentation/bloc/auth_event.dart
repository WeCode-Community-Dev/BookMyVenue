part of 'auth_bloc.dart';

@freezed
abstract class AuthEvent with _$AuthEvent {
  const factory AuthEvent.requestOtp({required OtpParams requestParam}) =
      _RequestOtpEvent;
}
