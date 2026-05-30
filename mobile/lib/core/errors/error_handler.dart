import 'package:dio/dio.dart';

import 'exceptions.dart';

class ErrorHandler {
  ErrorHandler._();

  static Exception handle(dynamic error) {
    if (error is DioException) {
      if (error.type == DioExceptionType.connectionError ||
          error.type == DioExceptionType.connectionTimeout) {
        return NetworkException('No internet connection');
      }

      final dynamic data = error.response?.data;
      if (data is Map<String, dynamic> && data.containsKey('message')) {
        return ServerException(data['message'] as String);
      }
      return ServerException('Something went wrong');
    }

    return UnknownException(error.toString());
  }
}
