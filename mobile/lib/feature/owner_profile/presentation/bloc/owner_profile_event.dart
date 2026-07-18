part of 'owner_profile_bloc.dart';

@freezed
class OwnerProfileEvent with _$OwnerProfileEvent {
  const factory OwnerProfileEvent.getOwnerProfile() = _GetOwnerProfile;
  const factory OwnerProfileEvent.logout() = _Logout;
}
