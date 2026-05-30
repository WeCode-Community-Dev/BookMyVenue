import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../entity/user_entity.dart';
import '../params/otp_param.dart';
import '../repository/i_auth_repository.dart';

class RequestOtpUseCase
    implements UseCase<ResultFuture<AuthResult>, OtpParams> {
  RequestOtpUseCase({required this.repository});
  final IAuthRepository repository;

  @override
  ResultFuture<AuthResult> call(OtpParams params) {
    return repository.requestOtp(params: params);
  }
}
