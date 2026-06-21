import '../../../../core/utils/type_def.dart';
import '../entity/owner_entity.dart';
import '../entity/user_entity.dart';
import '../params/auth_param.dart';

abstract interface class IAuthRepository {
  ResultFuture<OtpResponseResult> requestOtp({
    required OtpRequestParams params,
  });
  ResultFuture<VerifyOtpResponseResult> verifyOtp({
    required VerifyOtpRequestParams params,
  });
}

abstract interface class IOwnerAuthRepository {
  ResultFuture<RegisterResponseResult> registerAccount({
    required OwnerRegisterParams params,
  });
  ResultFuture<VerifyOwnerOtpResponseResult> verifyOtp({
    required VerifyOwnerOtpParams params,
  });
  ResultFuture<OwnerProfileResponseResult> getOwnerProfile();
}
