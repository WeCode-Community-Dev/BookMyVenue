class AuthEndpoints {
  AuthEndpoints._();

  static const String _v1 = '/api/v1/auth';

  static String get requestOtp => '$_v1/request-otp';
}
