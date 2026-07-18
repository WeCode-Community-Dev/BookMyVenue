import 'package:equatable/equatable.dart';

class OwnerProfileResult extends Equatable {
  const OwnerProfileResult({required this.message, required this.ownerProfile});

  final String message;
  final OwnerProfileResponseEntity ownerProfile;

  @override
  List<Object?> get props => <Object?>[message, ownerProfile];
}

class OwnerProfileResponseEntity extends Equatable {
  const OwnerProfileResponseEntity({
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
    this.ownerProfile,
  });

  final String id;
  final String mobileNumber;
  final String fullName;
  final String email;
  final bool mobileVerified;
  final bool emailVerified;
  final String role;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;
  final OwnerProfileDetailEntity? ownerProfile;

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
    ownerProfile,
  ];
}

class OwnerProfileDetailEntity extends Equatable {
  const OwnerProfileDetailEntity({
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
  final String approvalStatus;
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
