import 'package:dio/dio.dart';

import '../../logger/app_logger.dart';

class ErrorInterceptor extends Interceptor {
  ErrorInterceptor();

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    AppLogger.error('Network error', error: err, stackTrace: err.stackTrace);
    handler.next(err);
  }
}
