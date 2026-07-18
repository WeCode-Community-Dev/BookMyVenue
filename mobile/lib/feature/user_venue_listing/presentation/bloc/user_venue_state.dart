part of 'user_venue_bloc.dart';

enum UserVenueStatus { initial, loading, success, failure }

@freezed
sealed class UserVenueState with _$UserVenueState {
  const factory UserVenueState({
    @Default(UserVenueStatus.initial) UserVenueStatus status,
    @Default(<UserVenueEntity>[]) List<UserVenueEntity> venues,
    @Default(0) int skip,
    @Default(false) bool hasReachedMax,
    String? successMessage,
    String? errorMessage,
  }) = _UserVenueState;

  factory UserVenueState.initial() => const UserVenueState();
}
