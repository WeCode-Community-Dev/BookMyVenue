class AuthSession {
  static bool isLoggedIn = false;

  static Future<void> init() async {
    // final String? token = await sl<SecureStorageService>().getToken();

    // isLoggedIn = token != null && token.isNotEmpty;
  }
}
