part of 'user_profile_bloc.dart';

enum UserProfileStatus { initial, loading, success, failure }

@freezed
sealed class UserProfileState with _$UserProfileState {
  const factory UserProfileState({
    @Default(UserProfileStatus.initial) UserProfileStatus status,
    UserProfileResponseEntity? profile,
    String? successMessage,
    String? errorMessage,
    @Default(false) bool isLoggedOut,
  }) = _UserProfileState;

  factory UserProfileState.initial() => const UserProfileState();
}
