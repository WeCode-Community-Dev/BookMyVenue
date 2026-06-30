import 'package:dio/dio.dart';

import '../../core/di/injection.dart';
import '../auth/data/datasource/auth_local_datasource.dart';
import 'data/datasource/i_user_profile_remote_datasource.dart';
import 'data/datasource/user_profile_remote_datasource_impl.dart';
import 'data/repository/user_profile_repository_impl.dart';
import 'domain/repository/i_user_profile_repository.dart';
import 'domain/usecase/get_user_profile_usecase.dart';
import 'domain/usecase/user_logout_usecase.dart';
import 'presentation/bloc/user_profile_bloc.dart';

Future<void> registerUserProfileDependencies() async {
  /// Datasource
  sl.registerLazySingleton<IUserProfileRemoteDatasource>(
    () => UserProfileRemoteDatasourceImpl(sl<Dio>()),
  );

  /// Repository
  sl.registerLazySingleton<IUserProfileRepository>(
    () => UserProfileRepositoryImpl(
      remoteDatasource: sl<IUserProfileRemoteDatasource>(),
      localDatasource: sl<IAuthLocalDatasource>(),
    ),
  );

  /// UseCases
  sl.registerLazySingleton(
    () => GetUserProfileUseCase(repository: sl<IUserProfileRepository>()),
  );
  sl.registerLazySingleton(
    () => UserLogoutUseCase(repository: sl<IUserProfileRepository>()),
  );

  /// Bloc
  sl.registerFactory(
    () => UserProfileBloc(
      getUserProfileUseCase: sl<GetUserProfileUseCase>(),
      logoutUseCase: sl<UserLogoutUseCase>(),
    ),
  );
}
