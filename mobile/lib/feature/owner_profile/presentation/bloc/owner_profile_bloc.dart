import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fpdart/fpdart.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../../domain/entity/owner_profile_entity.dart';
import '../../domain/usecase/get_owner_profile_usecase.dart';
import '../../domain/usecase/owner_logout_usecase.dart';

part 'owner_profile_event.dart';
part 'owner_profile_state.dart';
part 'owner_profile_bloc.freezed.dart';

class OwnerProfileBloc extends Bloc<OwnerProfileEvent, OwnerProfileState> {
  OwnerProfileBloc({
    required GetOwnerProfileUseCase getOwnerProfileUseCase,
    required OwnerLogoutUseCase logoutUseCase,
  }) : _getOwnerProfileUseCase = getOwnerProfileUseCase,
       _logoutUseCase = logoutUseCase,
       super(OwnerProfileState.initial()) {
    on<_GetOwnerProfile>(_onGetOwnerProfile);
    on<_Logout>(_onLogout);
  }

  final GetOwnerProfileUseCase _getOwnerProfileUseCase;
  final OwnerLogoutUseCase _logoutUseCase;

  FutureOr<void> _onGetOwnerProfile(
    _GetOwnerProfile event,
    Emitter<OwnerProfileState> emit,
  ) async {
    emit(state.copyWith(status: OwnerProfileStatus.loading));

    final Either<Failure, OwnerProfileResult> result =
        await _getOwnerProfileUseCase(const NoParams());

    result.fold(
      (Failure failure) => emit(
        state.copyWith(
          status: OwnerProfileStatus.failure,
          errorMessage: failure.message,
        ),
      ),
      (OwnerProfileResult profile) => emit(
        state.copyWith(
          status: OwnerProfileStatus.success,
          successMessage: profile.message,
          profile: profile.ownerProfile,
        ),
      ),
    );
  }

  FutureOr<void> _onLogout(
    _Logout event,
    Emitter<OwnerProfileState> emit,
  ) async {
    emit(state.copyWith(status: OwnerProfileStatus.loading));

    final Either<Failure, void> result = await _logoutUseCase(const NoParams());

    result.fold(
      (Failure failure) => emit(
        state.copyWith(
          status: OwnerProfileStatus.failure,
          errorMessage: failure.message,
        ),
      ),
      (_) => emit(
        state.copyWith(
          status: OwnerProfileStatus.success,
          isLoggedOut: true,
        ),
      ),
    );
  }
}
