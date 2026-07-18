import 'package:dio/dio.dart';

import '../../core/di/injection.dart';
import 'data/datasource/i_user_venue_remote_datasource.dart';
import 'data/datasource/user_venue_remote_datasource_impl.dart';
import 'data/repository/user_venue_repository_impl.dart';
import 'domain/repository/i_user_venue_repository.dart';
import 'domain/usecase/get_user_venues_usecase.dart';
import 'presentation/bloc/user_venue_bloc.dart';

Future<void> registerUserVenueDependencies() async {
  /// Datasource
  sl.registerLazySingleton<IUserVenueRemoteDatasource>(
    () => UserVenueRemoteDatasourceImpl(sl<Dio>()),
  );

  /// Repository
  sl.registerLazySingleton<IUserVenueRepository>(
    () => UserVenueRepositoryImpl(
      remoteDatasource: sl<IUserVenueRemoteDatasource>(),
    ),
  );

  /// UseCases
  sl.registerLazySingleton(
    () => GetUserVenuesUseCase(repository: sl<IUserVenueRepository>()),
  );

  /// Bloc
  sl.registerFactory(
    () => UserVenueBloc(
      getUserVenuesUseCase: sl<GetUserVenuesUseCase>(),
    ),
  );
}
