class VenueManagementEndpoint {
  VenueManagementEndpoint._();

  static const String _v1 = '/api/v1/venue-owner/venue';

  static const String createVenue = '$_v1/create';
  static const String getVenue = _v1;
  static const String getAmenities = '$_v1/amenities';
}
