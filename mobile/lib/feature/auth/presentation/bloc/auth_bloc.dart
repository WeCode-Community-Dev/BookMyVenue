import 'dart:async';
import 'dart:developer';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fpdart/fpdart.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/notifications/notification_model.dart';
import '../../../../core/notifications/notification_service.dart';
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
    required NotificationService notificationService,
  }) : _notificationService = notificationService,
       _verifyOtpUseCase = verifyOtpUseCase,
       _requestOtpUseCase = requestOtpUseCase,
       super(const _AuthState()) {
    on<_RequestOtpEvent>(_onRequestOtpEvent);
    on<_VerifyOtpEvent>(_onVerifyOtpEvent);
  }

  final RequestOtpUseCase _requestOtpUseCase;
  final VerifyOtpUseCase _verifyOtpUseCase;
  final NotificationService _notificationService;

  FutureOr<void> _onRequestOtpEvent(
    _RequestOtpEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(
      state.copyWith(
        isLoading: true,
        isOtpRequesting: true,
        isError: false,
        successMessage: null,
        errorMessage: null,
      ),
    );

    final Either<Failure, OtpResponseResult> result = await _requestOtpUseCase(
      event.requestParam,
    );

    // if (result.isLeft()) {
    //   final Failure failure = result.swap().getOrElse(() => throw Exception());

    //   emit(
    //     state.copyWith(
    //       isLoading: false,
    //       isError: true,
    //       isOtpRequesting: false,
    //       errorMessage: failure.message,
    //     ),
    //   );

    //   return;
    // }

    // final authResult = result.getOrElse(() => throw Exception());

    // await _notificationService.showNotification(
    //   LocalNotification(
    //     id: 1001,
    //     title: 'Registration OTP',
    //     body: 'Your OTP is ${authResult.user.otp}',
    //   ),
    // );

    // emit(
    //   state.copyWith(
    //     isLoading: false,
    //     isError: false,
    //     successMessage: authResult.message,
    //     otpResponse: authResult.user,
    //   ),
    // );

    await result.fold<Future<void>>(
      (Failure failure) async {
        emit(
          state.copyWith(
            isLoading: false,
            isError: true,
            isOtpRequesting: false,
            successMessage: null,
            errorMessage: failure.message,
          ),
        );
      },
      (OtpResponseResult authResult) async {
        const int otpNotificationId = 1001;
        await _notificationService.showNotification(
          LocalNotification(
            id: otpNotificationId,
            title: 'Registration OTP',
            body: 'Your OTP is ${authResult.user.otp}',
          ),
        );
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
