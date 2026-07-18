import 'package:dio/dio.dart';

import '../../core/di/injection.dart';
import '../auth/data/datasource/auth_local_datasource.dart';
import 'data/datasource/i_owner_profile_remote_datasource.dart';
import 'data/datasource/owner_profile_remote_datasource_impl.dart';
import 'data/repository/owner_profile_repository_impl.dart';
import 'domain/repository/i_owner_profile_repository.dart';
import 'domain/usecase/get_owner_profile_usecase.dart';
import 'domain/usecase/owner_logout_usecase.dart';
import 'presentation/bloc/owner_profile_bloc.dart';

Future<void> registerOwnerProfileDependencies() async {
  /// Datasource
  sl.registerLazySingleton<IOwnerProfileRemoteDatasource>(
    () => OwnerProfileRemoteDatasourceImpl(sl<Dio>()),
  );

  /// Repository
  sl.registerLazySingleton<IOwnerProfileRepository>(
    () => OwnerProfileRepositoryImpl(
      remoteDatasource: sl<IOwnerProfileRemoteDatasource>(),
      localDatasource: sl<IAuthLocalDatasource>(),
    ),
  );

  /// UseCases
  sl.registerLazySingleton(
    () => GetOwnerProfileUseCase(repository: sl<IOwnerProfileRepository>()),
  );
  sl.registerLazySingleton(
    () => OwnerLogoutUseCase(repository: sl<IOwnerProfileRepository>()),
  );

  /// Bloc
  sl.registerFactory(
    () => OwnerProfileBloc(
      getOwnerProfileUseCase: sl<GetOwnerProfileUseCase>(),
      logoutUseCase: sl<OwnerLogoutUseCase>(),
    ),
  );
}
