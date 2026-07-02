class AuthEndpoints {
  AuthEndpoints._();

  static const String _v1 = '/api/v1/auth';

  static String get requestOtp => '$_v1/request-otp';
  static String get verifyOtp => '$_v1/verify-otp';
  static String get refreshToken => '$_v1/refresh-token';
}

class AuthOwnerEndpoints {
  AuthOwnerEndpoints._();

  static const String _v1 = '/api/v1/auth/venue-owner';

  static String get requestOtp => '$_v1/request-otp';
  static String get verifyOtp => '$_v1/verify-otp';
  static String get ownerProfileStatus => '$_v1/profile-status';
  static String get ownerProfile => '$_v1/profile';
  static String get refreshToken => '$_v1/refresh-token';
}
