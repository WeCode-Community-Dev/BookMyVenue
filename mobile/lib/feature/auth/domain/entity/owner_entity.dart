import 'package:equatable/equatable.dart';

class RegisterResponseResult extends Equatable {
  const RegisterResponseResult({required this.user, required this.message});

  final RegisterDataEntity user;
  final String message;

  @override
  List<Object?> get props => <Object?>[user, message];
}

class RegisterDataEntity extends Equatable {
  final String fullName;
  final String email;
  final String mobileNumber;
  final String otp;
  final int expiresInSeconds;
  final String message;

  const RegisterDataEntity({
    required this.fullName,
    required this.email,
    required this.mobileNumber,
    required this.otp,
    required this.expiresInSeconds,
    required this.message,
  });

  @override
  List<Object?> get props => [
    fullName,
    email,
    mobileNumber,
    otp,
    expiresInSeconds,
    message,
  ];
}
