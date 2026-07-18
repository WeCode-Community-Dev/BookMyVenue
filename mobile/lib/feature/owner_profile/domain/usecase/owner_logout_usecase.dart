import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../repository/i_owner_profile_repository.dart';

class OwnerLogoutUseCase extends UseCase<ResultFuture<void>, NoParams> {
  OwnerLogoutUseCase({required this.repository});

  final IOwnerProfileRepository repository;

  @override
  ResultFuture<void> call(NoParams params) async {
    return repository.logout();
  }
}
