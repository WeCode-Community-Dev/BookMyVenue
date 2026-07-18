import '../../feature/auth/domain/enums/approval_status.dart';
import '../../feature/auth/domain/enums/role_base.dart';
import '../di/injection.dart';
import '../logger/app_logger.dart';
import '../storage/secure_storage_service.dart';
import 'auth_session_model.dart';

class AuthSession {
  AuthSession._();
  static bool isLoggedIn = false;
  static UserRole? role;
  static ApprovalStatus ownerVerified = ApprovalStatus.pending;
  static String? ownerName;
  static String? userId;

  static Future<void> init() async {
    // await sl<SecureStorageService>().clearAll();
    final AuthSessionModel? user = await sl<SecureStorageService>()
        .getSession();

    AppLogger.info(' $user session user data');

    isLoggedIn = user != null && user.accessToken.isNotEmpty;
    role = user?.role;
    ownerVerified = user?.status ?? ApprovalStatus.pending;
    ownerName = user?.fullName;
    userId = user?.userId;
  }
}
