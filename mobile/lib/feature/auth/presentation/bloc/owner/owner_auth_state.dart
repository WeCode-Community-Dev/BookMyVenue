part of 'owner_auth_bloc.dart';

@freezed
abstract class OwnerAuthState with _$OwnerAuthState {
  const factory OwnerAuthState({
    @Default(false) bool isLoading,
    RegisterDataEntity? otpResponse,
    VerifyOtpDataEntity? verifyOtpResponse,
    String? successMessage,
    @Default(false) bool isError,
    String? errorMessage,

    /// Owner verification
    @Default(false) bool isVerificationRequestLoading,
    String? verificationSuccessMessage,
    @Default(false) bool isVerificationError,
    String? verificationErrorMessage,
    @Default(ApprovalStatus.pending) ApprovalStatus approvalStatus,
  }) = _OwnerAuthState;
}
