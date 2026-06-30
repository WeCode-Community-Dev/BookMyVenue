import '../../../../core/usecase/usecase.dart';
import '../../../../core/utils/type_def.dart';
import '../repository/i_user_profile_repository.dart';

class UserLogoutUseCase extends UseCase<ResultFuture<void>, NoParams> {
  UserLogoutUseCase({required this.repository});

  final IUserProfileRepository repository;

  @override
  ResultFuture<void> call(NoParams params) async {
    return repository.logout();
  }
}
