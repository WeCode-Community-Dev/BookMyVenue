import 'package:dio/dio.dart';

import '../../feature/auth/data/datasource/auth_local_datasource.dart';
import '../environment/app_env.dart';
import '../environment/config_env.dart';
import 'interceptors/auth_interceptor.dart';
import 'interceptors/error_interceptor.dart';
import 'interceptors/logging_interceptor.dart';

class ApiClient {
  ApiClient(this.storage) {
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
      AuthInterceptor(tokenStorage: storage, dio: dio),
      if (Environment.current == AppEnvironment.dev) LoggingInterceptor(),
      ErrorInterceptor(),
    ]);
  }
  final IAuthLocalDatasource storage;
  late final Dio dio;
}
