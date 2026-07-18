part of 'user_profile_bloc.dart';

@freezed
class UserProfileEvent with _$UserProfileEvent {
  const factory UserProfileEvent.getUserProfile() = _GetUserProfile;
  const factory UserProfileEvent.logout() = _Logout;
  const factory UserProfileEvent.updateUserProfile({
    required String fullName,
    required String email,
  }) = _UpdateUserProfile;
}
