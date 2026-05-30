import 'package:dio/dio.dart';

import '../../core/di/injection.dart';
import 'data/datasource/auth_remote_datasource_impl.dart';
import 'data/datasource/i_auth_remote_datasource.dart';
import 'data/repository/auth_repository_impl.dart';
import 'domain/repository/i_auth_repository.dart';
import 'domain/usecase/request_otp_usecase.dart';
import 'presentation/bloc/auth_bloc.dart';

Future<void> registerAuthDependencies() async {
  /// Datasource
  sl.registerLazySingleton<IAuthRemoteDatasource>(
    () => AuthRemoteDatasourceImpl(sl<Dio>()),
  );

  // sl.registerLazySingleton<IAuthLocalDatasource>(
  //   () => AuthLocalDatasourceImpl(sl<SecureStorageService>()),
  // );

  /// Repository
  sl.registerLazySingleton<IAuthRepository>(
    () => AuthRepositoryImpl(sl<IAuthRemoteDatasource>()),
  );

  /// UseCases
  sl.registerLazySingleton(
    () => RequestOtpUseCase(repository: sl<IAuthRepository>()),
  );

  /// Bloc
  sl.registerFactory(
    () => AuthBloc(requestOtpUseCase: sl<RequestOtpUseCase>()),
  );
}
