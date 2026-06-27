part of 'venue_bloc.dart';

enum VenueStatus { initial, loading, success, failure }

@freezed
sealed class VenueState with _$VenueState {
  const factory VenueState({
    @Default(VenueStatus.initial) VenueStatus addVenueStatus,
    @Default(VenueStatus.initial) VenueStatus getAllVenuesStatus,
    @Default(VenueStatus.initial) VenueStatus getVenueStatus,

    AddNewVenueEntity? addedVenue,
    @Default(<VenueEntity>[]) List<VenueEntity> venues,
    VenueEntity? selectedVenue,

    String? successMessage,
    String? errorMessage,
  }) = _VenueState;

  factory VenueState.initial() => const VenueState();
}
