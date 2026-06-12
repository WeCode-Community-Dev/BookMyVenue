part of 'owner_auth_bloc.dart';

@freezed
abstract class OwnerAuthState with _$OwnerAuthState {
  const factory OwnerAuthState({
    @Default(false) bool isLoading,
    @Default(false) bool isOtpRequesting,
    RegisterDataEntity? otpResponse,
    VerifyOtpDataEntity? verifyOtpResponse,
    String? successMessage,
    @Default(false) bool isError,
    String? errorMessage,
  }) = _OwnerAuthState;
}
