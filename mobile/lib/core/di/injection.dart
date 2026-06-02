import 'package:get_it/get_it.dart';

import '../../feature/auth/auth_injection.dart';
import '../network/api_client.dart';

final GetIt sl = GetIt.instance;

Future<void> setupInjector() async {
  await _registerCore();
  await registerAuthDependencies();
}

Future<void> _registerCore() async {
  /// Flutter Secure Storage instance
  // sl.registerLazySingleton(() => const FlutterSecureStorage());

  /// Secure Storage Service
  // sl.registerLazySingleton(
  //   () => SecureStorageService(sl<FlutterSecureStorage>()),
  // );

  /// Api Client
  sl.registerLazySingleton<ApiClient>(() => ApiClient());

  /// Dio instance
  sl.registerLazySingleton(() => sl<ApiClient>().dio);
}
