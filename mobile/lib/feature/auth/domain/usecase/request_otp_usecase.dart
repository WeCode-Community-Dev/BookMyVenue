import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../entity/user_entity.dart';
import '../params/otp_param.dart';
import '../repository/i_auth_repository.dart';

class RequestOtpUseCase
    implements UseCase<ResultFuture<OtpResponseResult>, OtpRequestParams> {
  RequestOtpUseCase({required this.repository});
  final IAuthRepository repository;

  @override
  ResultFuture<OtpResponseResult> call(OtpRequestParams params) {
    return repository.requestOtp(params: params);
  }
}
