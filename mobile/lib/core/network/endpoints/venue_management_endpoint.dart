class VenueManagementEndpoint {
  VenueManagementEndpoint._();

  static const String _v1 = '/api/v1/auth/venue-owner/venue';

  static const String createVenue = '$_v1/create';
  static const String getVenue = _v1;
}
