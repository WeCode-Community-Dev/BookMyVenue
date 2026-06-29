import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fpdart/fpdart.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../../core/errors/failures.dart';
import '../../../add_new_venue/domain/params/get_venue_params.dart';
import '../../domain/entity/user_venue_entity.dart';
import '../../domain/usecase/get_user_venues_usecase.dart';

part 'user_venue_event.dart';
part 'user_venue_state.dart';
part 'user_venue_bloc.freezed.dart';

class UserVenueBloc extends Bloc<UserVenueEvent, UserVenueState> {
  UserVenueBloc({required GetUserVenuesUseCase getUserVenuesUseCase})
    : _getUserVenuesUseCase = getUserVenuesUseCase,
      super(UserVenueState.initial()) {
    on<_GetUserVenues>(_onGetUserVenues);
  }

  final GetUserVenuesUseCase _getUserVenuesUseCase;

  FutureOr<void> _onGetUserVenues(
    _GetUserVenues event,
    Emitter<UserVenueState> emit,
  ) async {
    if (state.hasReachedMax && !event.isRefresh) {
      return;
    }

    final int currentSkip = event.isRefresh ? 0 : state.skip;
    const int limit = 20;

    if (currentSkip == 0) {
      emit(state.copyWith(status: UserVenueStatus.loading));
    }

    final Either<Failure, UserVenueResult> result = await _getUserVenuesUseCase(
      GetVenuesParams(skip: currentSkip, limit: limit),
    );

    result.fold(
      (Failure failure) => emit(
        state.copyWith(
          status: UserVenueStatus.failure,
          errorMessage: failure.message,
        ),
      ),
      (UserVenueResult venues) {
        final List<UserVenueEntity> allVenues =
            event.isRefresh
                  ? venues.venues
                  : List<UserVenueEntity>.from(state.venues)
              ..addAll(venues.venues);

        emit(
          state.copyWith(
            status: UserVenueStatus.success,
            venues: allVenues,
            successMessage: venues.message,
            skip: currentSkip + venues.venues.length,
            hasReachedMax: venues.venues.length < limit,
          ),
        );
      },
    );
  }
}
