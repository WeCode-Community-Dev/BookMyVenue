import '../../../../core/auth/auth_session_model.dart';
import '../../../../core/storage/secure_storage_service.dart';

abstract class IAuthLocalDatasource {
  Future<void> saveToken(AuthSessionModel token);
  Future<AuthSessionModel?> getToken();
}

class AuthLocalDatasourceImpl implements IAuthLocalDatasource {
  AuthLocalDatasourceImpl(this.storage);
  final SecureStorageService storage;

  @override
  Future<void> saveToken(AuthSessionModel token) {
    return storage.saveSession(token);
  }

  @override
  Future<AuthSessionModel?> getToken() {
    return storage.getSession();
  }
}
