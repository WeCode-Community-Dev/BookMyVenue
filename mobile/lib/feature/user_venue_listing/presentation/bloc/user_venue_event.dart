part of 'user_venue_bloc.dart';

@freezed
abstract class UserVenueEvent with _$UserVenueEvent {
  const factory UserVenueEvent.getUserVenues({@Default(false) bool isRefresh}) =
      _GetUserVenues;
}
