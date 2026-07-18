import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../entity/owner_entity.dart';
import '../repository/i_auth_repository.dart';

class GetOwnerProfileStatusUseCase
    implements UseCase<ResultFuture<OwnerProfileStatusResult>, NoParams> {
  GetOwnerProfileStatusUseCase({required this.ownerAuthRepository});

  final IOwnerAuthRepository ownerAuthRepository;

  @override
  ResultFuture<OwnerProfileStatusResult> call(NoParams params) async {
    return ownerAuthRepository.getOwnerProfileStatus();
  }
}
