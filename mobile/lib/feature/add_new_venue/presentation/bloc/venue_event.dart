part of 'venue_bloc.dart';

@freezed
sealed class VenueEvent with _$VenueEvent {
  const factory VenueEvent.addNewVenue({
    required AddNewVenueRequestParams params,
  }) = _AddNewVenue;

  const factory VenueEvent.getAllVenues({required GetVenuesParams params}) =
      _GetAllVenues;

  const factory VenueEvent.getVenueById({required String venueId}) =
      _GetVenueById;

  const factory VenueEvent.getAmenities() = _GetAmenities;
}
