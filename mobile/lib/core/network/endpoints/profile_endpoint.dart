class ProfileEndpoint {
  ProfileEndpoint._();

  static const String _v1 = '/api/v1/auth';

  static const String getOwnerProfile = '$_v1/venue-owner/profile';
  static const String getUserProfile = '$_v1/user/profile';
}
