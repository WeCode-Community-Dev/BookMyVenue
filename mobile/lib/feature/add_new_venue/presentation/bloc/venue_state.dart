part of 'venue_bloc.dart';

enum VenueStatus { initial, loading, uploading, success, failure }

@freezed
sealed class VenueState with _$VenueState {
  const factory VenueState({
    @Default(VenueStatus.initial) VenueStatus addVenueStatus,
    @Default(VenueStatus.initial) VenueStatus getAllVenuesStatus,
    @Default(VenueStatus.initial) VenueStatus getVenueStatus,
    @Default(VenueStatus.initial) VenueStatus getAmenitiesStatus,

    AddNewVenueEntity? addedVenue,
    @Default(<VenueEntity>[]) List<VenueEntity> venues,
    VenueEntity? selectedVenue,
    @Default(<VenueAmenityEntity>[]) List<VenueAmenityEntity> amenities,

    String? successMessage,
    String? errorMessage,
  }) = _VenueState;

  factory VenueState.initial() => const VenueState();
}
