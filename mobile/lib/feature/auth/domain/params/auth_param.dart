class OtpRequestParams {
  OtpRequestParams({required this.mobileNumber});
  final String mobileNumber;
}

class VerifyOtpRequestParams {
  VerifyOtpRequestParams({required this.mobileNumber, required this.otp});

  final String mobileNumber;
  final String otp;
}

class OwnerRegisterParams {
  const OwnerRegisterParams({
    required this.fullName,
    required this.businessName,
    required this.email,
    required this.mobileNumber,
    required this.password,
  });
  final String fullName;
  final String businessName;
  final String email;
  final String mobileNumber;
  final String password;
}

class VerifyOwnerOtpParams {
  const VerifyOwnerOtpParams({required this.mobileNumber, required this.otp});
  final String mobileNumber;
  final String otp;
}
