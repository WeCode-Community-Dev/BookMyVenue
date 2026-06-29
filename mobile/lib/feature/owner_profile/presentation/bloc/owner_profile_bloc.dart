import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fpdart/fpdart.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../../domain/entity/owner_profile_entity.dart';
import '../../domain/usecase/get_owner_profile_usecase.dart';

part 'owner_profile_event.dart';
part 'owner_profile_state.dart';
part 'owner_profile_bloc.freezed.dart';

class OwnerProfileBloc extends Bloc<OwnerProfileEvent, OwnerProfileState> {
  OwnerProfileBloc({required GetOwnerProfileUseCase getOwnerProfileUseCase})
    : _getOwnerProfileUseCase = getOwnerProfileUseCase,
      super(OwnerProfileState.initial()) {
    on<_GetOwnerProfile>(_onGetOwnerProfile);
  }

  final GetOwnerProfileUseCase _getOwnerProfileUseCase;

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
}
