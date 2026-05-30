import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fpdart/fpdart.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../../core/errors/failures.dart';
import '../../domain/entity/user_entity.dart';
import '../../domain/params/otp_param.dart';
import '../../domain/usecase/request_otp_usecase.dart';

part 'auth_event.dart';
part 'auth_state.dart';
part 'auth_bloc.freezed.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc({required RequestOtpUseCase requestOtpUseCase})
    : _requestOtpUseCase = requestOtpUseCase,
      super(const _AuthState()) {
    on<_RequestOtpEvent>(_onRequestOtpEvent);
  }

  final RequestOtpUseCase _requestOtpUseCase;

  FutureOr<void> _onRequestOtpEvent(
    _RequestOtpEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(
      state.copyWith(isLoading: true, isOtpRequesting: true, isError: false),
    );

    final Either<Failure, AuthResult> result = await _requestOtpUseCase(
      event.requestParam,
    );

    result.fold(
      (Failure failure) {
        emit(
          state.copyWith(
            isLoading: false,
            isError: true,
            isOtpRequesting: false,
            errorMessage: failure.message,
          ),
        );
      },
      (AuthResult authResult) {
        emit(
          state.copyWith(
            isLoading: false,
            isError: false,
            successMessage: authResult.message,
            otpResponse: authResult.user,
          ),
        );
      },
    );
  }
}
