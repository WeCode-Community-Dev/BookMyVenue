import '../../../../core/utils/type_def.dart';
import '../entity/user_entity.dart';
import '../params/otp_param.dart';

abstract interface class IAuthRepository {
  ResultFuture<AuthResult> requestOtp({required OtpParams params});
}
