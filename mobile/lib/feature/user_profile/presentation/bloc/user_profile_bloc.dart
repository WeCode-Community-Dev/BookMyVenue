import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fpdart/fpdart.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../../domain/entity/user_profile_entity.dart';
import '../../data/model/update_user_profile_request.dart';
import '../../domain/usecase/get_user_profile_usecase.dart';
import '../../domain/usecase/update_user_profile_usecase.dart';
import '../../domain/usecase/user_logout_usecase.dart';

part 'user_profile_event.dart';
part 'user_profile_state.dart';
part 'user_profile_bloc.freezed.dart';

class UserProfileBloc extends Bloc<UserProfileEvent, UserProfileState> {
  UserProfileBloc({
    required GetUserProfileUseCase getUserProfileUseCase,
    required UpdateUserProfileUseCase updateUserProfileUseCase,
    required UserLogoutUseCase logoutUseCase,
  }) : _getUserProfileUseCase = getUserProfileUseCase,
       _updateUserProfileUseCase = updateUserProfileUseCase,
       _logoutUseCase = logoutUseCase,
       super(UserProfileState.initial()) {
    on<_GetUserProfile>(_onGetUserProfile);
    on<_UpdateUserProfile>(_onUpdateUserProfile);
    on<_Logout>(_onLogout);
  }

  final GetUserProfileUseCase _getUserProfileUseCase;
  final UpdateUserProfileUseCase _updateUserProfileUseCase;
  final UserLogoutUseCase _logoutUseCase;

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
      (UserProfileResult userProfileResult) => emit(
        state.copyWith(
          status: UserProfileStatus.success,
          profile: userProfileResult.user,
        ),
      ),
    );
  }

  FutureOr<void> _onUpdateUserProfile(
    _UpdateUserProfile event,
    Emitter<UserProfileState> emit,
  ) async {
    emit(state.copyWith(status: UserProfileStatus.loading));

    final Either<Failure, UserProfileResult> result =
        await _updateUserProfileUseCase(
      UpdateUserProfileRequest(
        fullName: event.fullName,
        email: event.email,
      ),
    );

    result.fold(
      (Failure failure) => emit(
        state.copyWith(
          status: UserProfileStatus.failure,
          errorMessage: failure.message,
        ),
      ),
      (UserProfileResult userProfileResult) => emit(
        state.copyWith(
          status: UserProfileStatus.success,
          profile: userProfileResult.user,
          successMessage: 'Profile updated successfully',
        ),
      ),
    );
  }

  FutureOr<void> _onLogout(
    _Logout event,
    Emitter<UserProfileState> emit,
  ) async {
    emit(state.copyWith(status: UserProfileStatus.loading));

    final Either<Failure, void> result = await _logoutUseCase(const NoParams());

    result.fold(
      (Failure failure) => emit(
        state.copyWith(
          status: UserProfileStatus.failure,
          errorMessage: failure.message,
        ),
      ),
      (_) => emit(
        state.copyWith(
          status: UserProfileStatus.success,
          isLoggedOut: true,
        ),
      ),
    );
  }
}
