import 'package:dio/dio.dart';

abstract class AppException implements Exception {
  AppException(this.message, {this.statusCode});
  factory AppException.fromDio(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.connectionError:
        return NetworkException('No internet connection');

      case DioExceptionType.badResponse:
        final int? statusCode = e.response?.statusCode;

        if (statusCode == 401 || statusCode == 403) {
          return AuthException(
            'Session expired. Please login again.',
            statusCode: statusCode,
          );
        }

        return ServerException(
          e.response?.data?['message']?.toString() ?? 'Server error occurred',
          statusCode: statusCode,
        );

      case DioExceptionType.cancel:
        return NetworkException('Request cancelled');

      case DioExceptionType.unknown:
        return UnknownException('Unexpected error occurred');
      case DioExceptionType.badCertificate:
        return UnknownException('Bad certificate error occurred');
    }
  }
  final String message;
  final int? statusCode;
}

class NetworkException extends AppException {
  NetworkException(super.message);
}

class ServerException extends AppException {
  ServerException(super.message, {super.statusCode});
}

class AuthException extends AppException {
  AuthException(super.message, {super.statusCode});
}

class CacheException extends AppException {
  CacheException(super.message);
}

class UnknownException extends AppException {
  UnknownException(super.message);
}
