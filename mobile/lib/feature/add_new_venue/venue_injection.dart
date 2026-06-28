import 'package:dio/dio.dart';

import '../../core/di/injection.dart';
import 'data/datasource/add_new_venue_remote_datasource_impl.dart';
import 'data/datasource/i_add_new_venue_remote_datasource.dart';
import 'data/repository/venue_repository_impl.dart';
import 'domain/repository/i_venue_repository.dart';
import 'domain/usecase/add_new_venue_usecase.dart';
import 'domain/usecase/get_all_venues_usecase.dart';
import 'domain/usecase/get_venue_by_id_usecase.dart';
import 'presentation/bloc/venue_bloc.dart';

Future<void> registerVenueDependencies() async {
  /// Datasource
  sl.registerLazySingleton<IAddNewVenueRemoteDatasource>(
    () => AddNewVenueRemoteDatasourceImpl(sl<Dio>()),
  );

  /// Repository
  sl.registerLazySingleton<IVenueRepository>(
    () => VenueRepositoryImpl(remoteDatasource: sl<IAddNewVenueRemoteDatasource>()),
  );

  /// UseCases
  sl.registerLazySingleton(
    () => AddNewVenueUseCase(repository: sl<IVenueRepository>()),
  );
  sl.registerLazySingleton(
    () => GetAllVenuesUseCase(repository: sl<IVenueRepository>()),
  );
  sl.registerLazySingleton(
    () => GetVenueByIdUseCase(repository: sl<IVenueRepository>()),
  );

  /// Bloc
  sl.registerFactory(
    () => VenueBloc(
      addNewVenueUseCase: sl<AddNewVenueUseCase>(),
      getAllVenuesUseCase: sl<GetAllVenuesUseCase>(),
      getVenueByIdUseCase: sl<GetVenueByIdUseCase>(),
    ),
  );
}
