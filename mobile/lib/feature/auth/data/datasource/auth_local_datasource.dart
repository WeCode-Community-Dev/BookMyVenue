import '../../../../core/storage/secure_storage_service.dart';
import '../model/response_model/verify_otp_response/verify_otp_response.dart';

abstract class IAuthLocalDatasource {
  Future<void> saveToken(VerifyOtpResponse token);
  Future<VerifyOtpResponse?> getToken();
}

class AuthLocalDatasourceImpl implements IAuthLocalDatasource {
  AuthLocalDatasourceImpl(this.storage);
  final SecureStorageService storage;

  @override
  Future<void> saveToken(VerifyOtpResponse token) {
    return storage.saveToken(token);
  }

  @override
  Future<VerifyOtpResponse?> getToken() {
    return storage.getToken();
  }
}
