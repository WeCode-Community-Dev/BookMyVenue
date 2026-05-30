class OtpRequestParams {
  OtpRequestParams({required this.mobileNumber});
  final String mobileNumber;
}

class VerifyOtpRequestParams {
  VerifyOtpRequestParams({required this.mobileNumber, required this.otp});

  final String mobileNumber;
  final String otp;
}
