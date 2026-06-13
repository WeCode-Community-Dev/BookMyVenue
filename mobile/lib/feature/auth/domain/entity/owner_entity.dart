import 'package:equatable/equatable.dart';

import '../enums/approval_status.dart';
import '../enums/role_base.dart';

class RegisterResponseResult extends Equatable {
  const RegisterResponseResult({required this.user, required this.message});

  final RegisterDataEntity user;
  final String message;

  @override
  List<Object?> get props => <Object?>[user, message];
}

class RegisterDataEntity extends Equatable {
  const RegisterDataEntity({
    required this.fullName,
    required this.email,
    required this.mobileNumber,
    required this.otp,
    required this.expiresInSeconds,
    required this.message,
  });
  final String fullName;
  final String email;
  final String mobileNumber;
  final String otp;
  final int expiresInSeconds;
  final String message;

  @override
  List<Object?> get props => <Object?>[
    fullName,
    email,
    mobileNumber,
    otp,
    expiresInSeconds,
    message,
  ];
}

class VerifyOwnerOtpResponseResult extends Equatable {
  const VerifyOwnerOtpResponseResult({
    required this.user,
    required this.message,
  });

  final VerifyOtpDataEntity user;
  final String message;

  @override
  List<Object?> get props => <Object?>[user, message];
}

class VerifyOtpDataEntity extends Equatable {
  const VerifyOtpDataEntity({
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
    required this.ownerBusinessProfileEntity,
  });
  final String id;
  final String mobileNumber;
  final String fullName;
  final String email;
  final bool mobileVerified;
  final bool emailVerified;
  final UserRole role;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;
  final OwnerBusinessProfileEntity? ownerBusinessProfileEntity;

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

class OwnerBusinessProfileEntity extends Equatable {
  const OwnerBusinessProfileEntity({
    required this.id,
    required this.userId,
    required this.businessName,
    required this.approvalStatus,
    required this.createdAt,
    required this.updatedAt,
  });
  final String id;
  final String userId;
  final String businessName;
  final ApprovalStatus approvalStatus;
  final DateTime createdAt;
  final DateTime updatedAt;

  @override
  List<Object?> get props => <Object?>[
    id,
    userId,
    businessName,
    approvalStatus,
    createdAt,
    updatedAt,
  ];
}
