import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../auth/auth_session_model.dart';

abstract interface class ISecureStorageService {
  Future<void> saveSession(AuthSessionModel session);

  Future<AuthSessionModel?> getSession();

  Future<void> clearSession();

  Future<void> clearAll();
}

class SecureStorageService implements ISecureStorageService {
  SecureStorageService(this._storage);
  static const String _sessionKey = 'auth_session';

  final FlutterSecureStorage _storage;

  @override
  Future<void> saveSession(AuthSessionModel session) async {
    await _storage.write(key: _sessionKey, value: jsonEncode(session.toJson()));
  }

  @override
  Future<AuthSessionModel?> getSession() async {
    final String? result = await _storage.read(key: _sessionKey);

    if (result == null) {
      return null;
    }

    return AuthSessionModel.fromJson(
      jsonDecode(result) as Map<String, dynamic>,
    );
  }

  @override
  Future<void> clearSession() {
    return _storage.delete(key: _sessionKey);
  }

  @override
  Future<void> clearAll() {
    return _storage.deleteAll();
  }
}

// class SecureStorageService {
//   SecureStorageService(this._storage);
//   final FlutterSecureStorage _storage;

//   Future<void> saveToken(VerifyOtpResponse response) async {
//     final String result = jsonEncode(response);
//     await _storage.write(key: 'auth_token', value: result);
//   }

//   Future<VerifyOtpResponse?> getToken() async {
//     final String? result = await _storage.read(key: 'auth_token');
//     if (result == null) {
//       return null;
//     }
//     return VerifyOtpResponse.fromJson(
//       jsonDecode(result) as Map<String, dynamic>,
//     );
//   }

//   Future<void> clearToken() async {
//     await _storage.delete(key: 'auth_token');
//   }

//   Future<void> clearAll() async {
//     await _storage.deleteAll();
//   }
// }
