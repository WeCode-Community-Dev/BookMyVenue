import 'package:dio/dio.dart';

import '../../logger/app_logger.dart';

class LoggingInterceptor extends Interceptor {
  ///
  /// REQUEST
  ///
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final String message =
        '''
📤 REQUEST
🌍 URL        : ${options.baseUrl}${options.path}
🧾 METHOD     : ${options.method}

🪪 HEADERS
${_prettyMap(options.headers)}

🔑 TOKEN
${options.headers['Authorization'] ?? 'No Token'}

🔍 QUERY PARAMS
${_prettyMap(options.queryParameters)}

📦 BODY
${_prettyBody(options.data)}
''';

    AppLogger.debug(message, tag: 'API REQUEST');

    handler.next(options);
  }

  ///
  /// RESPONSE
  ///
  @override
  void onResponse(
    Response<dynamic> response,
    ResponseInterceptorHandler handler,
  ) {
    final String message =
        '''
📥 RESPONSE
🌍 URL        : ${response.requestOptions.baseUrl}${response.requestOptions.path}
🧾 METHOD     : ${response.requestOptions.method}
✅ STATUS     : ${response.statusCode}

📦 RESPONSE DATA
${_prettyBody(response.data)}
''';

    AppLogger.success(message, tag: 'API RESPONSE');

    handler.next(response);
  }

  ///
  /// ERROR
  ///
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    final String message =
        '''
❌ API ERROR
🌍 URL        : ${err.requestOptions.baseUrl}${err.requestOptions.path}
🧾 METHOD     : ${err.requestOptions.method}
🚨 STATUS     : ${err.response?.statusCode}

📄 MESSAGE
${err.message}

📦 ERROR RESPONSE
${_prettyBody(err.response?.data)}
''';

    AppLogger.error(
      message,
      tag: 'API ERROR',
      error: err,
      stackTrace: err.stackTrace,
    );

    handler.next(err);
  }

  ///
  /// PRETTY MAP
  ///
  String _prettyMap(Map<dynamic, dynamic>? map) {
    if (map == null || map.isEmpty) {
      return 'No Data';
    }

    return map.entries
        .map((MapEntry<dynamic, dynamic> e) => '• ${e.key} : ${e.value}')
        .join('\n');
  }

  ///
  /// PRETTY BODY
  ///
  String _prettyBody(dynamic data) {
    if (data == null) {
      return 'No Data';
    }

    if (data is Map || data is List) {
      return data.toString();
    }

    return data.toString();
  }
}
