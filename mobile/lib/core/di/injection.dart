import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get_it/get_it.dart';

import '../../feature/add_new_venue/venue_injection.dart';
import '../../feature/auth/auth_injection.dart';
import '../../feature/auth/data/datasource/auth_local_datasource.dart';
import '../../feature/owner_profile/owner_profile_injection.dart';
import '../network/api_client.dart';
import '../notifications/notification_service.dart';
import '../notifications/notification_service_impl.dart';
import '../storage/secure_storage_service.dart';

final GetIt sl = GetIt.instance;

Future<void> setupInjector() async {
  await _registerCore();
  await _registerLocalNotification();
  await registerAuthDependencies();
  await registerOwnerAuthDependencies();
  await registerVenueDependencies();
  await registerOwnerProfileDependencies();
}

Future<void> _registerCore() async {
  /// Flutter Secure Storage instance
  sl.registerLazySingleton(() => const FlutterSecureStorage());

  /// Secure Storage Service
  sl.registerLazySingleton(
    () => SecureStorageService(sl<FlutterSecureStorage>()),
  );

  /// Api Client
  sl.registerLazySingleton<ApiClient>(
    () => ApiClient(sl<IAuthLocalDatasource>()),
  );

  /// Dio instance
  sl.registerLazySingleton(() => sl<ApiClient>().dio);
}

Future<void> _registerLocalNotification() async {
  /// Register local notification
  sl.registerLazySingleton(FlutterLocalNotificationsPlugin.new);

  sl.registerLazySingleton<NotificationService>(
    () => NotificationServiceImpl(sl<FlutterLocalNotificationsPlugin>()),
  );

  /// Initialize local notification
  await sl<NotificationService>().initialize();
}
