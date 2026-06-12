import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../entity/owner_entity.dart';
import '../params/auth_param.dart';
import '../repository/i_auth_repository.dart';

class VerifyOwnerOtpUseCase
    implements
        UseCase<
          ResultFuture<VerifyOwnerOtpResponseResult>,
          VerifyOwnerOtpParams
        > {
  VerifyOwnerOtpUseCase({required this.ownerAuthRepository});

  final IOwnerAuthRepository ownerAuthRepository;

  @override
  ResultFuture<VerifyOwnerOtpResponseResult> call(
    VerifyOwnerOtpParams params,
  ) async {
    return ownerAuthRepository.verifyOtp(params: params);
  }
}
