import 'package:equatable/equatable.dart';

import '../enums/role_base.dart';

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

class VerifyOtpResponseResult extends Equatable {
  const VerifyOtpResponseResult({required this.result, required this.message});

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
    required this.fullName,
    required this.email,
    required this.mobileVerified,
    required this.emailVerified,
    required this.role,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  final String id;
  final String mobileNumber;
  final String? email;
  final String fullName;
  final bool mobileVerified;
  final bool emailVerified;
  final UserRole role;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;

  @override
  List<Object?> get props => <Object?>[
    id,
    mobileNumber,
    fullName,
    email,
    mobileVerified,
    emailVerified,
    role,
    status,
    createdAt,
    updatedAt,
  ];
}
