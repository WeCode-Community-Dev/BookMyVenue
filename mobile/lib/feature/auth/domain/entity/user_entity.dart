import 'package:equatable/equatable.dart';

class OtpResponseEntity extends Equatable {
  const OtpResponseEntity({
    required this.mobileNumber,
    required this.otp,
    required this.expiresInSeconds,
    required this.message,
  });

  final String mobileNumber;
  final String otp;
  final String expiresInSeconds;
  final String message;

  @override
  List<Object?> get props => <Object?>[
    mobileNumber,
    otp,
    expiresInSeconds,
    message,
  ];
}

class AuthResult extends Equatable {
  const AuthResult({required this.user, required this.message});

  final OtpResponseEntity user;
  final String message;

  @override
  List<Object?> get props => <Object?>[user, message];
}
