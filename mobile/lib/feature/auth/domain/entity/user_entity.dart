import 'package:equatable/equatable.dart';

// =========== Request Otp Entity ================

class OtpResponseResult extends Equatable {
  const OtpResponseResult({required this.user, required this.message});

  final OtpResponseEntity user;
  final String message;

  @override
  List<Object?> get props => <Object?>[user, message];
}

class OtpResponseEntity extends Equatable {
  const OtpResponseEntity({
    required this.mobileNumber,
    required this.otp,
    required this.expiresInSeconds,
    required this.message,
  });

  final String mobileNumber;
  final String otp;
  final int expiresInSeconds;
  final String message;

  @override
  List<Object?> get props => <Object?>[
    mobileNumber,
    otp,
    expiresInSeconds,
    message,
  ];
}

// =========== Verify Otp Entity ================

class VerifyOtpRequestResult extends Equatable {
  const VerifyOtpRequestResult({required this.result, required this.message});

  final VerifyOtpResponseEntity result;
  final String message;

  @override
  List<Object?> get props => <Object?>[result, message];
}

class VerifyOtpResponseEntity extends Equatable {
  const VerifyOtpResponseEntity({
    required this.accessToken,
    required this.refreshToken,
    required this.tokenType,
    required this.user,
  });

  final String accessToken;
  final String refreshToken;
  final String tokenType;
  final UserEntity user;

  @override
  List<Object?> get props => <Object?>[
    accessToken,
    refreshToken,
    tokenType,
    user,
  ];
}

class UserEntity extends Equatable {
  const UserEntity({
    required this.id,
    required this.mobileNumber,
    required this.isActive,
    required this.createdAt,
  });
  final String id;
  final String mobileNumber;
  final bool isActive;
  final DateTime createdAt;

  @override
  List<Object?> get props => <Object?>[id, mobileNumber, isActive, createdAt];
}
