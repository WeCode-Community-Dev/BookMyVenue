import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../entity/owner_entity.dart';
import '../params/auth_param.dart';
import '../repository/i_auth_repository.dart';

class RegisterAccountUseCase
    implements
        UseCase<ResultFuture<RegisterResponseResult>, OwnerRegisterParams> {
  RegisterAccountUseCase({required this.ownerAuthRepository});

  final IOwnerAuthRepository ownerAuthRepository;

  @override
  ResultFuture<RegisterResponseResult> call(OwnerRegisterParams params) async {
    return ownerAuthRepository.registerAccount(params: params);
  }
}
