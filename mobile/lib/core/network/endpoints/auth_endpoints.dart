class AuthEndpoints {
  AuthEndpoints._();

  static const String _v1 = '/api/v1/auth';

  static String get requestOtp => '$_v1/request-otp';
  static String get verifyOtp => '$_v1/verify-otp';
}

class AuthOwnerEndpoints {
  AuthOwnerEndpoints._();

  static const String _v1 = '/api/v1/auth/venue-owner';

  static String get requestOtp => '$_v1/request-otp';
  static String get verifyOtp => '$_v1/verify-otp';
}
