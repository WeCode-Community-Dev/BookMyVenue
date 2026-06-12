import '../../feature/auth/data/model/user/response_model/verify_otp_response/verify_otp_response.dart';
import '../di/injection.dart';
import '../storage/secure_storage_service.dart';

class AuthSession {
  static bool isLoggedIn = false;

  static Future<void> init() async {
    final VerifyOtpResponse? token = await sl<SecureStorageService>()
        .getToken();

    isLoggedIn = token != null && token.accessToken.isNotEmpty;
  }
}
