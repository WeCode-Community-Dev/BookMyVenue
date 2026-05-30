import '../../../../core/utils/type_def.dart';
import '../entity/user_entity.dart';
import '../params/otp_param.dart';

abstract interface class IAuthRepository {
  ResultFuture<OtpResponseResult> requestOtp({
    required OtpRequestParams params,
  });
  ResultFuture<VerifyOtpRequestResult> verifyOtp({
    required VerifyOtpRequestParams params,
  });
}
