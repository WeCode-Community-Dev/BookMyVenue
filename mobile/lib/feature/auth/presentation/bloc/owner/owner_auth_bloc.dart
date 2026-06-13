import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fpdart/fpdart.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../../../../../core/errors/failures.dart';
import '../../../../../core/notifications/notification_model.dart';
import '../../../../../core/notifications/notification_service.dart';
import '../../../domain/entity/owner_entity.dart';
import '../../../domain/params/auth_param.dart';
import '../../../domain/usecase/register_account_usecase.dart';
import '../../../domain/usecase/verify_owner_otp_usecase.dart';

part 'owner_auth_event.dart';
part 'owner_auth_state.dart';
part 'owner_auth_bloc.freezed.dart';

class OwnerAuthBloc extends Bloc<OwnerAuthEvent, OwnerAuthState> {
  OwnerAuthBloc({
    required RegisterAccountUseCase registerAccountUseCase,
    required VerifyOwnerOtpUseCase verifyOwnerOtpUseCase,
    required NotificationService notificationService,
  }) : _registerAccountUseCase = registerAccountUseCase,
       _verifyOwnerOtpUseCase = verifyOwnerOtpUseCase,
       _notificationService = notificationService,
       super(const _OwnerAuthState()) {
    on<_RegisterAccountEvent>(_onRegisterAccountEvent);
    on<_VerifyOwnerOtpEvent>(_onVerifyOwnerOtp);
  }

  final RegisterAccountUseCase _registerAccountUseCase;
  final VerifyOwnerOtpUseCase _verifyOwnerOtpUseCase;
  final NotificationService _notificationService;

  FutureOr<void> _onRegisterAccountEvent(
    _RegisterAccountEvent event,
    Emitter<OwnerAuthState> emit,
  ) async {
    emit(
      state.copyWith(
        isLoading: true,
        isError: false,
        successMessage: null,
        errorMessage: null,
      ),
    );

    final Either<Failure, RegisterResponseResult> result =
        await _registerAccountUseCase(event.requestParam);

    await result.fold<Future<void>>(
      (Failure failure) async {
        emit(
          state.copyWith(
            isLoading: false,
            isError: true,
            successMessage: null,
            errorMessage: failure.message,
          ),
        );
      },
      (RegisterResponseResult authResult) async {
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

  FutureOr<void> _onVerifyOwnerOtp(
    _VerifyOwnerOtpEvent event,
    Emitter<OwnerAuthState> emit,
  ) async {
    emit(state.copyWith(isLoading: true, isError: false));

    final Either<Failure, VerifyOwnerOtpResponseResult> result =
        await _verifyOwnerOtpUseCase(event.requestParam);

    result.fold(
      (Failure failure) {
        emit(
          state.copyWith(
            isLoading: false,
            isError: true,
            errorMessage: failure.message,
          ),
        );
      },
      (VerifyOwnerOtpResponseResult verifyOtpResult) {
        emit(
          state.copyWith(
            isLoading: false,
            isError: false,
            successMessage: verifyOtpResult.message,
            verifyOtpResponse: verifyOtpResult.user,
          ),
        );
      },
    );
  }
}
