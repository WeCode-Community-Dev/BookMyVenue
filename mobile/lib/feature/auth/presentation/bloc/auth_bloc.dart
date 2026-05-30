import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fpdart/fpdart.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../../core/errors/failures.dart';
import '../../domain/entity/user_entity.dart';
import '../../domain/params/otp_param.dart';
import '../../domain/usecase/request_otp_usecase.dart';
import '../../domain/usecase/verify_otp_usecase.dart';

part 'auth_event.dart';
part 'auth_state.dart';
part 'auth_bloc.freezed.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc({
    required RequestOtpUseCase requestOtpUseCase,
    required VerifyOtpUseCase verifyOtpUseCase,
  }) : _verifyOtpUseCase = verifyOtpUseCase,
       _requestOtpUseCase = requestOtpUseCase,
       super(const _AuthState()) {
    on<_RequestOtpEvent>(_onRequestOtpEvent);
    on<_VerifyOtpEvent>(_onVerifyOtpEvent);
  }

  final RequestOtpUseCase _requestOtpUseCase;
  final VerifyOtpUseCase _verifyOtpUseCase;

  FutureOr<void> _onRequestOtpEvent(
    _RequestOtpEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(
      state.copyWith(isLoading: true, isOtpRequesting: true, isError: false),
    );

    final Either<Failure, OtpResponseResult> result = await _requestOtpUseCase(
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
      (OtpResponseResult authResult) {
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

  FutureOr<void> _onVerifyOtpEvent(
    _VerifyOtpEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(state.copyWith(isLoading: true, isError: false));

    final Either<Failure, VerifyOtpRequestResult> result =
        await _verifyOtpUseCase(event.requestParam);

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
      (VerifyOtpRequestResult verifyOtpResult) {
        emit(
          state.copyWith(
            isLoading: false,
            isError: false,
            successMessage: verifyOtpResult.message,
            verifyOtpResponse: verifyOtpResult.result,
          ),
        );
      },
    );
  }
}
