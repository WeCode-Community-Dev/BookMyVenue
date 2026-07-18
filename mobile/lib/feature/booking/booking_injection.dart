import 'package:dio/dio.dart';

import '../../core/di/injection.dart';
import 'data/datasource/booking_remote_datasource_impl.dart';
import 'data/datasource/i_booking_remote_datasource.dart';
import 'data/repository/booking_repository_impl.dart';
import 'domain/repository/i_booking_repository.dart';
import 'domain/usecase/booking_usecases.dart';
import 'presentation/bloc/booking_bloc.dart';

Future<void> registerBookingDependencies() async {
  /// Datasource
  sl.registerLazySingleton<IBookingRemoteDatasource>(
    () => BookingRemoteDatasourceImpl(sl<Dio>()),
  );

  /// Repository
  sl.registerLazySingleton<IBookingRepository>(
    () => BookingRepositoryImpl(
      remoteDatasource: sl<IBookingRemoteDatasource>(),
    ),
  );

  /// UseCases
  sl.registerLazySingleton(
    () => CheckoutUseCase(repository: sl<IBookingRepository>()),
  );
  sl.registerLazySingleton(
    () => VerifyPaymentUseCase(repository: sl<IBookingRepository>()),
  );
  sl.registerLazySingleton(
    () => CancelBookingUseCase(repository: sl<IBookingRepository>()),
  );
  sl.registerLazySingleton(
    () => GetMyBookingsUseCase(repository: sl<IBookingRepository>()),
  );
  sl.registerLazySingleton(
    () => GetOwnerBookingsUseCase(repository: sl<IBookingRepository>()),
  );

  /// Bloc
  sl.registerFactory(
    () => BookingBloc(
      checkoutUseCase: sl<CheckoutUseCase>(),
      verifyPaymentUseCase: sl<VerifyPaymentUseCase>(),
      cancelBookingUseCase: sl<CancelBookingUseCase>(),
      getMyBookingsUseCase: sl<GetMyBookingsUseCase>(),
      getOwnerBookingsUseCase: sl<GetOwnerBookingsUseCase>(),
    ),
  );
}
