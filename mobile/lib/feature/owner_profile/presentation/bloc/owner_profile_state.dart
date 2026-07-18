part of 'owner_profile_bloc.dart';

enum OwnerProfileStatus { initial, loading, success, failure }

@freezed
sealed class OwnerProfileState with _$OwnerProfileState {
  const factory OwnerProfileState({
    @Default(OwnerProfileStatus.initial) OwnerProfileStatus status,
    OwnerProfileResponseEntity? profile,
    String? errorMessage,
    String? successMessage,
    @Default(false) bool isLoggedOut,
  }) = _OwnerProfileState;

  factory OwnerProfileState.initial() => const OwnerProfileState();
}
