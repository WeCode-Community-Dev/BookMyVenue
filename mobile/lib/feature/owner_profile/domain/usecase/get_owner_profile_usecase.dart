import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../entity/owner_profile_entity.dart';
import '../repository/i_owner_profile_repository.dart';

class GetOwnerProfileUseCase
    extends UseCase<ResultFuture<OwnerProfileResult>, NoParams> {
  GetOwnerProfileUseCase({required this.repository});

  final IOwnerProfileRepository repository;

  @override
  ResultFuture<OwnerProfileResult> call(NoParams params) async {
    return repository.getOwnerProfile();
  }
}
