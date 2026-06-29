import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fpdart/fpdart.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../../domain/entity/user_profile_entity.dart';
import '../../domain/usecase/get_user_profile_usecase.dart';

part 'user_profile_event.dart';
part 'user_profile_state.dart';
part 'user_profile_bloc.freezed.dart';

class UserProfileBloc extends Bloc<UserProfileEvent, UserProfileState> {
  UserProfileBloc({required GetUserProfileUseCase getUserProfileUseCase})
    : _getUserProfileUseCase = getUserProfileUseCase,
      super(UserProfileState.initial()) {
    on<_GetUserProfile>(_onGetUserProfile);
  }

  final GetUserProfileUseCase _getUserProfileUseCase;

  FutureOr<void> _onGetUserProfile(
    _GetUserProfile event,
    Emitter<UserProfileState> emit,
  ) async {
    emit(state.copyWith(status: UserProfileStatus.loading));

    final Either<Failure, UserProfileResult> result =
        await _getUserProfileUseCase(const NoParams());

    result.fold(
      (Failure failure) => emit(
        state.copyWith(
          status: UserProfileStatus.failure,
          errorMessage: failure.message,
        ),
      ),
      (UserProfileResult profile) => emit(
        state.copyWith(
          status: UserProfileStatus.success,
          successMessage: profile.message,
          profile: profile.user,
        ),
      ),
    );
  }
}
