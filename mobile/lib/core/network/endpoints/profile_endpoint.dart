class ProfileEndpoint {
  ProfileEndpoint._();

  static const String _v1 = '/api/v1/auth/venue-owner';

  static const String getOwnerProfile = '$_v1/profile';
}
