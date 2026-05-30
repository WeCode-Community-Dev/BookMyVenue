import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../entity/user_entity.dart';
import '../params/otp_param.dart';
import '../repository/i_auth_repository.dart';

class VerifyOtpUseCase
    implements
        UseCase<ResultFuture<VerifyOtpRequestResult>, VerifyOtpRequestParams> {
  VerifyOtpUseCase({required this.repository});
  final IAuthRepository repository;

  @override
  ResultFuture<VerifyOtpRequestResult> call(VerifyOtpRequestParams params) {
    return repository.verifyOtp(params: params);
  }
}
