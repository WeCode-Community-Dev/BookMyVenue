part of 'auth_bloc.dart';

@freezed
abstract class AuthState with _$AuthState {
  const factory AuthState({
    @Default(false) bool isLoading,
    @Default(false) bool isOtpRequesting,
    OtpResponseEntity? otpResponse,
    VerifyOtpResponseEntity? verifyOtpResponse,
    String? successMessage,
    @Default(false) bool isError,
    String? errorMessage,
  }) = _AuthState;
}
