import 'package:dio/dio.dart';

import '../environment/app_env.dart';
import '../environment/config_env.dart';
import 'interceptors/error_interceptor.dart';
import 'interceptors/logging_interceptor.dart';

class ApiClient {
  ApiClient() {
    dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: <String, dynamic>{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    dio.interceptors.addAll(<Interceptor>[
      if (Environment.current == AppEnvironment.dev) LoggingInterceptor(),
      ErrorInterceptor(),
    ]);
  }

  late final Dio dio;
}
