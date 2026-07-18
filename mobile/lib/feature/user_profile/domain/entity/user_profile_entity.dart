import 'package:equatable/equatable.dart';

class UserProfileResult extends Equatable {
  const UserProfileResult({required this.message, required this.user});

  final String message;
  final UserProfileResponseEntity user;

  @override
  List<Object?> get props => <Object?>[message, user];
}

class UserProfileResponseEntity extends Equatable {
  const UserProfileResponseEntity({
    required this.id,
    required this.mobileNumber,
    this.fullName,
    this.email,
    required this.mobileVerified,
    required this.emailVerified,
    required this.role,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  final String id;
  final String mobileNumber;
  final String? fullName;
  final String? email;
  final bool mobileVerified;
  final bool emailVerified;
  final String role;
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
