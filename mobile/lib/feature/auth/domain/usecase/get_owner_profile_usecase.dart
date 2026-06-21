import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../entity/owner_entity.dart';
import '../repository/i_auth_repository.dart';

class GetOwnerProfileUseCase
    implements UseCase<ResultFuture<OwnerProfileResponseResult>, NoParams> {
  GetOwnerProfileUseCase({required this.ownerAuthRepository});

  final IOwnerAuthRepository ownerAuthRepository;

  @override
  ResultFuture<OwnerProfileResponseResult> call(NoParams params) async {
    return ownerAuthRepository.getOwnerProfile();
  }
}
