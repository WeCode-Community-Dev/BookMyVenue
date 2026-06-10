import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../feature/auth/data/model/response_model/verify_otp_response/verify_otp_response.dart';

class SecureStorageService {
  SecureStorageService(this._storage);
  final FlutterSecureStorage _storage;

  Future<void> saveToken(VerifyOtpResponse response) async {
    final String result = jsonEncode(response);
    await _storage.write(key: 'auth_token', value: result);
  }

  Future<VerifyOtpResponse?> getToken() async {
    final String? result = await _storage.read(key: 'auth_token');
    if (result == null) {
      return null;
    }
    return VerifyOtpResponse.fromJson(
      jsonDecode(result) as Map<String, dynamic>,
    );
  }

  Future<void> clearToken() async {
    await _storage.delete(key: 'auth_token');
  }

  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
