import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../entity/user_entity.dart';
import '../params/auth_param.dart';
import '../repository/i_auth_repository.dart';

class VerifyOtpUseCase
    implements
        UseCase<ResultFuture<VerifyOtpResponseResult>, VerifyOtpRequestParams> {
  VerifyOtpUseCase({required this.repository});
  final IAuthRepository repository;

  @override
  ResultFuture<VerifyOtpResponseResult> call(VerifyOtpRequestParams params) {
    return repository.verifyOtp(params: params);
  }
}
